import { CommonModule, NgIf } from '@angular/common';
import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ItemsService } from '../items/items.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ItemInterface } from '../items/items.interface';
import { ItemType } from '../items/enums/item-type.enum';
import { MatSelectModule } from '@angular/material/select';
import {
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';
import { NgxDropzoneModule } from 'ngx-dropzone';

import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CategoryInterface } from '../items/category-interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  standalone: true,
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    NgbDropdownModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSnackBarModule,
    NgxDropzoneModule,
  ],
})
export class ListComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  value = '';
  isChecked: boolean = false;
  hasErrors = false;
  isCategoryDropdownOpen: boolean = false;
  modalRef?: BsModalRef;
  files: File[] = [];
  items: ItemInterface[] = [];
  filteredItems: ItemInterface[] = [];
  selectedCategory: string = 'Armas';
  selectedFile: File | null = null;
  editMode: boolean = false;
  modalItem: ItemInterface = {
    _id: '',
    name: '',
    brand: '',
    model: '',
    color: '',
    image: '',
    quantity: 0,
    description: '',
    price: 0,
    category: ItemType.Default,
    // subCategory: null,
    isAvailable: false,
    showPrice: false,
  };
  itemForm: UntypedFormGroup;
  category: any = {
    0: 'Armas',
    1: 'Armas',
    2: 'Municion',
    3: 'Accesorios',
    4: 'Ropa',
    5: 'Recarga',
  };
  categories: ItemType[] = [
    ItemType.Guns,
    ItemType.Accessories,
    ItemType.Ammo,
    ItemType.Clothes,
    ItemType.Gunpowder,
    ItemType.Reload,
  ];
  constructor(
    private itemsService: ItemsService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.itemForm = this.formBuilder.group({
      name: [
        this.modalItem.name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      brand: [
        this.modalItem.brand,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      model: [
        this.modalItem.model,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
        ],
      ],
      color: [
        this.modalItem.color,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      image: [this.modalItem.image, [Validators.required]],
      quantity: [
        this.modalItem.quantity,
        [Validators.required, Validators.min(1), Validators.max(1000)],
      ],
      description: [
        this.modalItem.description,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      price: [
        this.modalItem.price,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(10000),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ],
      ],
      category: [this.modalItem.category, Validators.required],
      // subCategory: [this.modalItem.subCategory, Validators.required],
      isAvailable: [this.modalItem.isAvailable, Validators.required],
      showPrice: [this.modalItem.showPrice, Validators.required],
    });
  }

  initForm(): void {}
  selectCategory(event: any) {
    this.selectedCategory = this.category[event.index];
    this.updateFilteredItems();
  }

  ngOnInit(): void {
    this.itemsService.getAllItems().subscribe((data: ItemInterface[]) => {
      this.items = data;
      this.updateFilteredItems();
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.modalItem.image = reader.result as string;
      };
    }
  }

  onSelect(event: { addedFiles: any }) {
    this.files.push(...event.addedFiles);

    this.selectedFile = this.files[0];
  }

  onRemove(event: File) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  updateFilteredItems() {
    this.filteredItems = this.items.filter(
      (item) => item.category === this.selectedCategory
    );
  }

  openModal(template: TemplateRef<any>, item: ItemInterface) {
    this.modalItem = { ...item };
    this.modalRef = this.modalService.show(template);
    this.resetForm();

    this.editMode = false;
  }

  resetForm() {
    this.files = [];
    this.selectedFile = null;
  }

  updateItem() {
    const formData = new FormData();

    formData.append('name', this.modalItem.name);
    formData.append('brand', this.modalItem.brand);
    formData.append('model', this.modalItem.model);
    formData.append('color', this.modalItem.color);
    formData.append('quantity', String(this.modalItem.quantity));
    formData.append('description', this.modalItem.description);
    formData.append('price', String(this.modalItem.price));
    formData.append('category', this.modalItem.category);
    formData.append('isAvailable', String(this.modalItem.isAvailable));
    formData.append('showPrice', String(this.modalItem.showPrice));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.itemsService
      .updateItem(this.modalItem._id || 'no llega el ID', formData)
      .subscribe((updatedItem) => {
        const index = this.items.findIndex(
          (item) => item._id === updatedItem._id
        );
        if (index !== -1) {
          this.items[index] = updatedItem;
          this.updateFilteredItems();
        }

        this.itemForm.patchValue(updatedItem);

        this.showSuccessNotification('Elemento actualizado exitosamente.');
        this.modalRef?.hide();
      });
  }

  openCreateModal(template: TemplateRef<any>) {
    this.modalItem = {
      name: '',
      brand: '',
      model: '',
      color: '',
      image: '',
      quantity: 0,
      description: '',
      price: 0,
      category: ItemType.Guns,
      // subCategory: null,
      isAvailable: false,
      showPrice: false,
    };

    this.modalRef = this.modalService.show(template);
    this.editMode = false;
  }

  deleteItem(item: ItemInterface) {
    if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      this.itemsService.deleteItem(item).subscribe(() => {
        // Elimina el elemento de la lista
        const index = this.items.findIndex((i) => i._id === item._id);
        if (index !== -1) {
          this.items.splice(index, 1);
          this.updateFilteredItems();
        }
      });
    }
  }

  createNewItem() {
    const formData = new FormData();

    formData.append('name', this.modalItem.name);
    formData.append('brand', this.modalItem.brand);
    formData.append('model', this.modalItem.model);
    formData.append('color', this.modalItem.color);
    formData.append('quantity', String(this.modalItem.quantity));
    formData.append('description', this.modalItem.description);
    formData.append('price', String(this.modalItem.price));
    formData.append('category', this.modalItem.category);
    // formData.append('subCategory', JSON.stringify(this.modalItem.subCategory));
    formData.append('isAvailable', String(this.modalItem.isAvailable));
    formData.append('showPrice', String(this.modalItem.showPrice));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.itemsService.createItem(formData).subscribe((newItem) => {
      this.items.push(newItem);
      this.updateFilteredItems();
      this.modalRef?.hide();
    });
  }

  showSuccessNotification(message: string) {
    this.snackBar.open(message, 'Aceptar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,
      panelClass: 'success-notification',
    });
  }

  showErrorNotification(message: string) {
    this.snackBar.open(message, 'Aceptar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2000,

      panelClass: 'error-notification',
    });
  }
}
