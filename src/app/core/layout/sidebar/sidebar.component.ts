import { Component } from '@angular/core';
import { MENU_ITEMS } from './menu-items.constants';
import { MenuItem } from './menu-item.model';
import { MatListModule, MatNavList } from '@angular/material/list';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [],
  imports: [MatNavList, MatListModule, TranslatePipe, RouterLink, RouterLinkActive],
})
export class AppSidebarComponent {
  public menuItems: MenuItem[] = MENU_ITEMS;

  public constructor() {}
}
