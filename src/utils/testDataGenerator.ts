import { supabase } from '@/integrations/supabase/client';

export const generateTestData = async () => {
  console.log('Starting test data generation...');

  try {
    // 1. Create test developers
    const developers = [
      {
        name: 'Test Developer Alpha',
        contact_info: { email: 'alpha@test.com', phone: '+357-99-123456' },
        status: 'active',
        commission_rate: 3.5
      },
      {
        name: 'Test Developer Beta',
        contact_info: { email: 'beta@test.com', phone: '+357-99-234567' },
        status: 'active',
        commission_rate: 4.0
      },
      {
        name: 'Test Developer Gamma',
        contact_info: { email: 'gamma@test.com', phone: '+357-99-345678' },
        status: 'active',
        commission_rate: 3.0
      }
    ];

    const { data: createdDevelopers, error: devError } = await supabase
      .from('developers')
      .insert(developers)
      .select();

    if (devError) throw devError;
    console.log('Created developers:', createdDevelopers.length);

    // 2. Create test projects for each developer
    const projects = [];
    const zones = ['limassol', 'paphos', 'larnaca', 'nicosia'];
    const statuses = ['available', 'under_construction', 'delivered'];
    
    for (const dev of createdDevelopers) {
      for (let i = 1; i <= 2; i++) {
        const price = Math.floor(Math.random() * 500000) + 100000;
        projects.push({
          title: `Test Project ${dev.name} - ${i}`,
          description: `Description for test project ${i} by ${dev.name}`,
          type: i % 2 === 0 ? 'apartment' : 'villa',
          price: price,
          price_from: price.toString(),
          golden_visa_eligible: price >= 300000,
          developer_id: dev.id,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          cyprus_zone: zones[Math.floor(Math.random() * zones.length)],
          location: {
            city: 'Test City',
            address: `Test Address ${i}`,
            coordinates: { lat: 34.6851, lng: 33.0439 }
          },
          completion_date: '2024-12-31',
          units_available: Math.floor(Math.random() * 20) + 5,
          total_units: Math.floor(Math.random() * 50) + 20,
          features: ['Test Feature 1', 'Test Feature 2'],
          amenities: ['Pool', 'Gym', 'Parking']
        });
      }
    }

    const { data: createdProjects, error: projectError } = await supabase
      .from('projects')
      .insert(projects)
      .select();

    if (projectError) throw projectError;
    console.log('Created projects:', createdProjects.length);

    // 3. Create test buildings for each project
    const buildings = [];
    const constructionStatuses = ['planning', 'foundation', 'structure', 'finishing', 'completed'];

    for (const project of createdProjects) {
      for (let i = 1; i <= 2; i++) {
        buildings.push({
          name: `Building ${i} - ${project.title}`,
          project_id: project.id,
          building_type: 'residential',
          construction_status: constructionStatuses[Math.floor(Math.random() * constructionStatuses.length)],
          total_floors: Math.floor(Math.random() * 10) + 3,
          total_units: Math.floor(Math.random() * 30) + 10
        });
      }
    }

    const { data: createdBuildings, error: buildingError } = await supabase
      .from('buildings')
      .insert(buildings)
      .select();

    if (buildingError) throw buildingError;
    console.log('Created buildings:', createdBuildings.length);

    // 4. Create test leads
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Tom', 'Anna'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
    const leadStatuses = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed'];
    const urgencies = ['exploring', '6_months', '3_months', '1_month', 'immediate'];
    const propertyTypes = ['apartment', 'villa', 'penthouse', 'commercial'];

    const leads = [];
    for (let i = 1; i <= 20; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const budgetMin = Math.floor(Math.random() * 300000) + 100000;
      const budgetMax = budgetMin + Math.floor(Math.random() * 200000) + 50000;

      leads.push({
        first_name: firstName,
        last_name: lastName,
        email: `test.lead.${i}@test.com`,
        phone: `+357-99-${String(i).padStart(6, '0')}`,
        status: leadStatuses[Math.floor(Math.random() * leadStatuses.length)],
        urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
        property_type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        budget_min: budgetMin,
        budget_max: budgetMax,
        golden_visa_interest: budgetMax >= 300000,
        source: 'test_data',
        notes: `Test lead ${i} - Generated for testing purposes`,
        score: Math.floor(Math.random() * 5) + 1,
        zones: [zones[Math.floor(Math.random() * zones.length)]]
      });
    }

    const { data: createdLeads, error: leadError } = await supabase
      .from('leads')
      .insert(leads)
      .select();

    if (leadError) throw leadError;
    console.log('Created leads:', createdLeads.length);

    // 5. Create test commissions - Fix promoter_id to use correct developers
    const commissions = [];
    
    // Get all promoters to use their IDs
    const { data: promoters } = await supabase.from('promoters').select('*').limit(1);
    
    for (let i = 0; i < Math.min(5, createdProjects.length); i++) {
      const project = createdProjects[i];
      const developer = createdDevelopers.find(d => d.id === project.developer_id);
      
      if (developer && promoters && promoters.length > 0) {
        commissions.push({
          promoter_id: promoters[0].id, // Use existing promoter
          project_id: project.id,
          amount: project.price_from * (developer.commission_rate / 100),
          status: Math.random() > 0.5 ? 'pending' : 'paid',
          date: new Date().toISOString()
        });
      }
    }

    if (commissions.length > 0) {
      const { data: createdCommissions, error: commissionError } = await supabase
        .from('commissions')
        .insert(commissions)
        .select();

      if (commissionError) throw commissionError;
      console.log('Created commissions:', createdCommissions.length);
    }

    console.log('Test data generation completed successfully');
    
    return {
      developers: createdDevelopers.length,
      projects: createdProjects.length,
      buildings: createdBuildings.length,
      leads: createdLeads.length,
      commissions: commissions.length
    };

  } catch (error) {
    console.error('Error generating test data:', error);
    throw error;
  }
};

export const resetTestData = async () => {
  console.log('Starting test data cleanup...');

  try {
    // Delete in reverse order due to foreign key constraints
    
    // 1. Delete test commissions
    const { error: commissionError } = await supabase
      .from('commissions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (commissionError) console.warn('Commission deletion error:', commissionError);

    // 2. Delete test leads
    const { error: leadError } = await supabase
      .from('leads')
      .delete()
      .eq('source', 'test_data');

    if (leadError) console.warn('Lead deletion error:', leadError);

    // 3. Delete test buildings
    const { error: buildingError } = await supabase
      .from('buildings')
      .delete()
      .like('name', 'Building %Test Project%');

    if (buildingError) console.warn('Building deletion error:', buildingError);

    // 4. Delete test projects
    const { error: projectError } = await supabase
      .from('projects')
      .delete()
      .like('title', 'Test Project%');

    if (projectError) console.warn('Project deletion error:', projectError);

    // 5. Delete test developers
    const { error: developerError } = await supabase
      .from('developers')
      .delete()
      .like('name', 'Test Developer%');

    if (developerError) console.warn('Developer deletion error:', developerError);

    console.log('Test data cleanup completed');

  } catch (error) {
    console.error('Error during test data cleanup:', error);
    throw error;
  }
};