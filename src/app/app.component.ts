import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

export interface ITableData {
  product: string;
  drink?: string;
  food?: string;
  comment?: string;
}

export interface IForm {
  product: FormControl<IProduct>,
  drink?: FormControl<string>,
  food?: FormControl<string>,
  comment?: FormControl<string>
}

export interface IProduct {
  title: string;
  isHasDrink: boolean;
  isHasFood: boolean;
  isHasComment: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit {
  displayedColumns: string[] = ['product', 'drink', 'food', 'comment'];
  data$: BehaviorSubject<ITableData[] | []> = new BehaviorSubject<ITableData[]>([]);
  productList: IProduct[] = [
    {title: 'Продукт 1', isHasDrink: true, isHasFood: false, isHasComment: false},
    {title: 'Продукт 2', isHasDrink: true, isHasFood: true, isHasComment: true},
  ];
  drinkList: string[] = [
    'Напиток 1',
    'Напиток 2'
  ];
  foodList: string[] = [
    'Блюдо 1',
    'Блюдо 2'
  ];

  form = new FormGroup(<IForm>{
    product: new FormControl(),
    drink: new FormControl(''),
    food: new FormControl(''),
    comment: new FormControl('')
  });

  ngOnInit(): void {
    this.getLocalDataTable();
  }

  getLocalDataTable(): void {
    const localData: string | null = localStorage.getItem('dataTable');
    if (localData) {
      return this.data$.next(<ITableData[]>JSON.parse(<string>localStorage.getItem('dataTable')) || [])
    }
  }

  validateForm(): boolean {
    return (this.form.controls.product.value.isHasDrink ? !!this.form.controls.drink?.value : true) &&
      (this.form.controls.product.value.isHasFood ? !!this.form.controls?.food?.value : true);
  }

  submitForm(): void {
    if (this.validateForm()) {
      const body: ITableData = {
        ...this.form.value,
        product: this.form.value.product!.title
      };
      this.data$.next([...this.data$.getValue(), body]);
      localStorage.setItem('dataTable', JSON.stringify(this.data$.getValue()))
      this.resetForm();
    }
  }

  resetForm(): void {
    this.form.reset();
  }
}
