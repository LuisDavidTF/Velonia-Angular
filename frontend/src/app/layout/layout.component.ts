import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { AuthModalComponent } from 'app/shared/auth-modal/auth-modal.component';
import { FlashComponent } from 'app/shared/flash/flash.component';
@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,NavbarComponent,FooterComponent,AuthModalComponent,FlashComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
