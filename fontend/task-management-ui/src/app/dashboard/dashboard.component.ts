import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  tasks:any ;

  constructor() {
    this.tasks = [
      { title: 'First Task', description: 'This is the first task', status: 'Not Started', assignedBy: 'User1', assignedTo: 'User2' },
      { title: 'Second Task', description: 'This is the second task', status: 'In Progress', assignedBy: 'User2', assignedTo: 'User3' },
      { title: 'Third Task', description: 'This is the third task', status: 'Not Started', assignedBy: 'User3', assignedTo: 'User4' },
      { title: 'Fourth Task', description: 'This is the fourth task', status: 'Completed', assignedBy: 'User4', assignedTo: 'User5' },
      { title: 'Fifth Task', description: 'This is the fifth task', status: 'Not Started', assignedBy: 'User5', assignedTo: 'User6' },
      { title: 'Sixth Task', description: 'This is the sixth task', status: 'In Progress', assignedBy: 'User6', assignedTo: 'User7' },
      { title: 'Seventh Task', description: 'This is the seventh task', status: 'Not Started', assignedBy: 'User7', assignedTo: 'User8' },
      { title: 'Eighth Task', description: 'This is the eighth task', status: 'Completed', assignedBy: 'User8', assignedTo: 'User9' },
      { title: 'Ninth Task', description: 'This is the ninth task', status: 'Not Started', assignedBy: 'User9', assignedTo: 'User10' },
      { title: 'Tenth Task', description: 'This is the tenth task', status: 'In Progress', assignedBy: 'User10', assignedTo: 'User1' },
    ];
      
   }

}
