#!/usr/bin/env python3
"""
Script to fix ProjectFormSteps.tsx by adding rendering logic for 3 new steps.

This script:
1. Reads the ProjectFormSteps.tsx file
2. Finds the end of the component (before the final return/closing brace)
3. Inserts the 3 new step rendering conditions
4. Writes the modified file back
"""

import re
import sys
from pathlib import Path

# Define the code to insert
CODE_TO_INSERT = '''
  // ==========================================
  // NEW STEPS: Project Amenities
  // ==========================================
  if (currentStep === 'project-amenities') {
    return <ProjectAmenitiesStep form={form} />;
  }

  // ==========================================
  // NEW STEPS: Legal & Compliance
  // ==========================================
  if (currentStep === 'legal-compliance') {
    return <LegalComplianceStep form={form} />;
  }

  // ==========================================
  // NEW STEPS: Utilities & Services
  // ==========================================
  if (currentStep === 'utilities-services') {
    return <UtilitiesServicesStep form={form} />;
  }
'''

def fix_project_form_steps():
    """Add rendering logic for 3 new project form steps."""
    
    file_path = Path('src/components/admin/projects/ProjectFormSteps.tsx')
    
    if not file_path.exists():
        print(f"❌ Error: File not found: {file_path}")
        sys.exit(1)
    
    print(f"📖 Reading {file_path}...")
    content = file_path.read_text(encoding='utf-8')
    
    # Check if the fix is already applied
    if "'project-amenities'" in content and "'legal-compliance'" in content and "'utilities-services'" in content:
        print("✅ Fix already applied! The 3 new steps are already present.")
        return False
    
    print("🔍 Searching for insertion point...")
    
    # Strategy: Find the last meaningful line before the component's closing
    # We'll look for common patterns at the end of React components
    
    # Pattern 1: Find the last if/else statement checking currentStep
    # Pattern 2: Find where we typically return a default/fallback step
    # Pattern 3: Find the component's closing brace
    
    # Split content into lines for easier manipulation
    lines = content.split('\n')
    
    # Find the last occurrence of a step condition or the final return
    insertion_line = -1
    
    # Look for patterns like:
    # - return render*Step()
    # - return <*Step />
    # - final closing of the component
    
    for i in range(len(lines) - 1, -1, -1):
        line = lines[i].strip()
        
        # Look for the last if statement checking currentStep
        if 'if (currentStep ===' in line or 'if(currentStep===' in line:
            # Found a step condition, insert after its closing brace
            # Find the closing of this if block
            brace_count = 0
            found_opening = False
            for j in range(i, len(lines)):
                if '{' in lines[j]:
                    found_opening = True
                    brace_count += lines[j].count('{')
                if '}' in lines[j]:
                    brace_count -= lines[j].count('}')
                if found_opening and brace_count == 0:
                    insertion_line = j + 1
                    break
            if insertion_line > 0:
                break
        
        # Alternative: Look for a final return statement
        if insertion_line < 0 and 'return' in line and 'Step' in line:
            insertion_line = i
            break
    
    # If still not found, try to find the component's closing
    if insertion_line < 0:
        # Find the export statement or closing brace of ProjectFormSteps
        for i in range(len(lines) - 1, -1, -1):
            if 'export' in lines[i] and 'ProjectFormSteps' in lines[i]:
                insertion_line = i
                break
            if lines[i].strip() == '};' and i > len(lines) - 50:
                insertion_line = i
                break
    
    if insertion_line < 0:
        print("❌ Error: Could not find insertion point")
        sys.exit(1)
    
    print(f"✅ Found insertion point at line {insertion_line + 1}")
    
    # Create backup
    backup_path = file_path.with_suffix('.tsx.backup')
    print(f"💾 Creating backup: {backup_path}")
    backup_path.write_text(content, encoding='utf-8')
    
    # Insert the code
    print("✏️  Inserting new step rendering logic...")
    lines.insert(insertion_line, CODE_TO_INSERT)
    
    # Write the modified content
    modified_content = '\n'.join(lines)
    file_path.write_text(modified_content, encoding='utf-8')
    
    print("✅ Fix applied successfully!")
    print(f"📝 Modified {file_path}")
    print(f"💾 Backup saved to {backup_path}")
    print("\n🎯 Next steps:")
    print("1. Review the changes: git diff src/components/admin/projects/ProjectFormSteps.tsx")
    print("2. Test the form navigation")
    print("3. Commit: git add . && git commit -m 'fix: Add rendering logic for 3 new project form steps'")
    
    return True

if __name__ == '__main__':
    print("🚀 Starting ProjectFormSteps.tsx fix...")
    print("="*60)
    
    success = fix_project_form_steps()
    
    if success:
        print("\n" + "="*60)
        print("✨ Fix completed successfully!")
    else:
        print("\n" + "="*60)
        print("ℹ️  No changes needed")
