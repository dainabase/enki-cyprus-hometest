import { supabase } from '@/integrations/supabase/client';

export interface IntegrityReport {
  orphanedProjects: number;
  orphanedBuildings: number;
  duplicateEmails: number;
  missingGoldenVisa: number;
  invalidPrices: number;
  missingRequiredFields: number;
  totalIssues: number;
  details: {
    orphanedProjects: any[];
    orphanedBuildings: any[];
    duplicateEmails: any[];
    missingGoldenVisa: any[];
    invalidPrices: any[];
    missingRequiredFields: any[];
  };
}

export const checkDataIntegrity = async (): Promise<IntegrityReport> => {
  console.log('Starting data integrity check...');

  const report: IntegrityReport = {
    orphanedProjects: 0,
    orphanedBuildings: 0,
    duplicateEmails: 0,
    missingGoldenVisa: 0,
    invalidPrices: 0,
    missingRequiredFields: 0,
    totalIssues: 0,
    details: {
      orphanedProjects: [],
      orphanedBuildings: [],
      duplicateEmails: [],
      missingGoldenVisa: [],
      invalidPrices: [],
      missingRequiredFields: []
    }
  };

  try {
    // 1. Check for orphaned projects (projects without developers)
    const { data: orphanedProjects, error: orphanError } = await supabase
      .from('projects')
      .select('id, title, developer_id')
      .is('developer_id', null);

    if (orphanError) throw orphanError;

    if (orphanedProjects) {
      report.orphanedProjects = orphanedProjects.length;
      report.details.orphanedProjects = orphanedProjects;
    }

    // 2. Check for orphaned buildings (buildings without projects)
    const { data: orphanedBuildings, error: buildingOrphanError } = await supabase
      .from('buildings')
      .select('id, name, project_id')
      .is('project_id', null);

    if (buildingOrphanError) throw buildingOrphanError;

    if (orphanedBuildings) {
      report.orphanedBuildings = orphanedBuildings.length;
      report.details.orphanedBuildings = orphanedBuildings;
    }

    // 3. Check for duplicate emails in leads
    const { data: allLeads, error: leadsError } = await supabase
      .from('leads')
      .select('id, email, first_name, last_name');

    if (leadsError) throw leadsError;

    if (allLeads) {
      const emailGroups = allLeads.reduce((acc, lead) => {
        if (!acc[lead.email]) {
          acc[lead.email] = [];
        }
        acc[lead.email].push(lead);
        return acc;
      }, {} as Record<string, any[]>);

      const duplicates = Object.entries(emailGroups)
        .filter(([email, leads]) => leads.length > 1)
        .map(([email, leads]) => ({ email, leads }));

      report.duplicateEmails = duplicates.length;
      report.details.duplicateEmails = duplicates;
    }

    // 4. Check for missing Golden Visa flags (properties >= 300k without flag)
    const { data: missingGoldenVisa, error: goldenVisaError } = await supabase
      .from('projects')
      .select('id, title, price_from, golden_visa_eligible')
      .gte('price_from', 300000)
      .eq('golden_visa_eligible', false);

    if (goldenVisaError) throw goldenVisaError;

    if (missingGoldenVisa) {
      report.missingGoldenVisa = missingGoldenVisa.length;
      report.details.missingGoldenVisa = missingGoldenVisa;
    }

    // 5. Check for invalid prices (negative or zero prices)
    const { data: invalidPrices, error: priceError } = await supabase
      .from('projects')
      .select('id, title, price_from')
      .or('price_from.lte.0,price_from.is.null');

    if (priceError) throw priceError;

    if (invalidPrices) {
      report.invalidPrices = invalidPrices.length;
      report.details.invalidPrices = invalidPrices;
    }

    // 6. Check for missing required fields
    const missingFields = [];

    // Check projects without titles
    const { data: projectsWithoutTitle, error: titleError } = await supabase
      .from('projects')
      .select('id, title, description')
      .or('title.is.null,title.eq.,description.is.null,description.eq.');

    if (titleError) throw titleError;

    if (projectsWithoutTitle && projectsWithoutTitle.length > 0) {
      missingFields.push(...projectsWithoutTitle.map(p => ({
        type: 'project',
        id: p.id,
        issue: 'Missing title or description'
      })));
    }

    // Check leads without names
    const { data: leadsWithoutName, error: nameError } = await supabase
      .from('leads')
      .select('id, first_name, last_name, email')
      .or('first_name.is.null,first_name.eq.,last_name.is.null,last_name.eq.');

    if (nameError) throw nameError;

    if (leadsWithoutName && leadsWithoutName.length > 0) {
      missingFields.push(...leadsWithoutName.map(l => ({
        type: 'lead',
        id: l.id,
        issue: 'Missing first name or last name'
      })));
    }

    report.missingRequiredFields = missingFields.length;
    report.details.missingRequiredFields = missingFields;

    // Calculate total issues
    report.totalIssues = 
      report.orphanedProjects +
      report.orphanedBuildings +
      report.duplicateEmails +
      report.missingGoldenVisa +
      report.invalidPrices +
      report.missingRequiredFields;

    console.log('Data integrity check completed:', report);
    return report;

  } catch (error) {
    console.error('Error during data integrity check:', error);
    throw error;
  }
};

export const fixDataIntegrityIssues = async () => {
  console.log('Starting automatic data integrity fixes...');

  try {
    // 1. Fix Golden Visa flags
    const { error: goldenVisaFixError } = await supabase
      .from('projects')
      .update({ golden_visa_eligible: true })
      .gte('price', 300000)
      .eq('golden_visa_eligible', false);

    if (goldenVisaFixError) throw goldenVisaFixError;

    // 2. Fix invalid prices (set to minimum valid price)
    const { error: priceFixError } = await supabase
      .from('projects')
      .update({ price: 50000 })
      .or('price.lte.0,price.is.null');

    if (priceFixError) throw priceFixError;

    console.log('Automatic fixes completed');

  } catch (error) {
    console.error('Error during automatic fixes:', error);
    throw error;
  }
};