import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ZorroModule } from '../../../zorro.module';
import { AlertService } from '../../../services/alert/alert.service';
import { ItemAttributeService } from '../item-attribute.service';

@Component({
  selector: 'app-item-attribute-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    ZorroModule,
  ],
  templateUrl: './item-attribute-detail.component.html',
  styleUrl: './item-attribute-detail.component.scss'
})
export class ItemAttributeDetailComponent implements OnInit, OnDestroy {
  itemAttributeId!: number;

  readonly alertService = inject(AlertService);
  readonly itemAttributeService = inject(ItemAttributeService);
  readonly router = inject(Router);
  readonly fb = inject(NonNullableFormBuilder);
  readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  pageIndex: number = 1;
  pageSize: number = 10;
  sortField: any = '';
  sortOrder: any = '';

  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required])
  });

  constructor(
    readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.pageIndex = queryParams['pageIndex'] ?? 1;
    this.pageSize = queryParams['pageSize'] ?? 10;
    this.sortField = queryParams['sortField'] ?? '';
    this.sortOrder = queryParams['sortOrder'] ?? '';
    this.itemAttributeId = +this.route.snapshot.paramMap.get('id')!;
    if (this.itemAttributeId) {
      this.loadItemAttribute(this.itemAttributeId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItemAttribute(id: number): void {
    this.itemAttributeService.getItemAttribute(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.validateForm.patchValue({
            name: data.name,
            description: data.description
          });
        },
        error: (err) => {
          this.alertService.showAlert(
            'error',
            err.error?.message ?? this.translate.instant('ITEM_ATTRIBUTE.RECORD_NOT_FOUND'),
            err.error?.details ?? []
          );
          this.router.navigate(['/item-attribute/list']);
        }
      });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const formValue = this.validateForm.value;
      this.itemAttributeService.updateItemAttribute({
        id: this.itemAttributeId,
        ...formValue
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.alertService.showAlert(
              'success',
              this.translate.instant('ITEM_ATTRIBUTE.RECORD_UPDATED'),
              []
            );
            this.router.navigate(['/item-attribute/edit', this.itemAttributeId]);
          },
          error: (err) => {
            this.alertService.showAlert(
              'error',
              err.error?.message ?? this.translate.instant('ITEM_ATTRIBUTE.FAILED_TO_UPDATE'),
              err.error?.details ?? []
            );
          }
        });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/item-attribute/list'], {
      queryParams: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder
      }
    });
  }
}
