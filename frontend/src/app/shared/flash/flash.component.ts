import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlashAlertService } from 'app/services/flash-alert/flash-alert.service';

@Component({
  selector: 'app-flash',
  imports: [CommonModule],
  templateUrl: './flash.component.html',
  styleUrl: './flash.component.css'
})
export class FlashComponent {
  constructor(public flashAlertService:FlashAlertService){

  }
}
