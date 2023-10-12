import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItemsService } from '../items/items.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: true,
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
})
export class ListComponent implements OnInit {
  value = '';
  items: any[] = [];
  filteredItems: any[] = [];
  selectedCategory: string = 'Guns';
  category: any = {
    0: 'Guns',
    1: 'Guns',
    2: 'Ammo',
    3: 'Accessories',
    4: 'Clothes',
    5: 'Guns',
  };

  constructor(private itemsService: ItemsService) {}

  selectCategory(event: any) {
    this.selectedCategory = this.category[event.index];
    this.updateFilteredItems();
  }

  ngOnInit(): void {
    this.itemsService.getAllItems().subscribe((data) => {
      this.items = data;
      console.log(this.items);

      this.updateFilteredItems();
    });
  }

  updateFilteredItems() {
    this.filteredItems = this.items.filter(
      (item) => item.category === this.selectedCategory
    );
  }
}
