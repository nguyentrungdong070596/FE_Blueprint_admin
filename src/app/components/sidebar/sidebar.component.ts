import { Component, EventEmitter, Output } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, ImageModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Output() isToggleChange = new EventEmitter<boolean>();
  isToggle: boolean = false;
  onToggleSidebar(){
    this.isToggle = !this.isToggle;
    this.isToggleChange.emit(this.isToggle);
  }
}
