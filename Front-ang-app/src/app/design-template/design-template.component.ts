import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-design-template',
  templateUrl: './design-template.component.html',
  styleUrls: ['./design-template.component.css'],
})
export class DesignTemplateComponent implements OnInit {
  // List of templates
  templates = [
    { id: 1, category: 'Featured', title: 'Iconic', description: 'Let\'s get the party started!', image: 'images/event-01.png' },
    { id: 2, category: 'Featured', title: 'Vivid', description: 'Bring your conference to life.', image: 'images/event-02.jpg' },
    { id: 3, category: 'Featured', title: 'Canvas', description: 'Ideal for weddings or anniversaries.', image: 'images/event-01.png' },
    { id: 4, category: 'Featured', title: 'Expedition', description: 'Perfect for trips or festivals.', image: 'images/event-03.jpg' },
    { id: 5, category: 'Standard', title: 'Classic', description: 'Timeless layout for any event.', image: 'images/event-02.jpg' },
    { id: 6, category: 'Standard', title: 'Modern', description: 'Great for professional events.', image: 'images/event-01.png' },
    { id: 7, category: 'Standard', title: 'Minimalist', description: 'Clean and minimal design.', image: 'images/event-03.jpg' },
    { id: 8, category: 'Standard', title: 'Elegant', description: 'Classy event design.', image: 'images/event-01.png' },
  ];

  filteredTemplates = this.templates; // Filtered list of templates
  currentStep: number = 1; // Step tracking (1: Template Selection, 2: Event Details)
  selectedFilter = 'Featured'; // Default filter category

  @Input() selectedTemplate: any; // Selected template data
  @Output() templateSelected = new EventEmitter<any>(); // Emit selected template

  ngOnInit() {
    this.filterTemplates(this.selectedFilter); // Apply default filter on initialization
  }

  // Change step in the process
  changeStep(step: number): void {
    if (step < 1 || step > 2) {
      console.error('Invalid step:', step);
      return;
    }
    this.currentStep = step;
  }


  // Filter templates based on category
  filterTemplates(category: string): void {
    console.log('Filtering templates by category:', category);
    this.selectedFilter = category;
    this.filteredTemplates = this.templates.filter(template =>
      template.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Select a template and move to the next step
  selectTemplate(template: any): void {
    this.selectedTemplate = template;
    this.templateSelected.emit(template); // Emit selected template to parent (if needed)
    this.changeStep(2); // Move to the Event Details step
  }
}
