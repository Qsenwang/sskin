import {Component, OnInit} from '@angular/core';
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {FormFieldErrorsComponent} from "@shared/form-field-errors/form-field-errors.component";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {CommonModule} from "@angular/common";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTableModule} from "ng-zorro-antd/table";
import {TreatmentItemDto, TreatmentItemTypeDto} from "@shared/sskinModel/sskinDto.model";
import {TreatmentItemService} from "./treatmentItem.service";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {NzOptionComponent, NzSelectComponent} from "ng-zorro-antd/select";
import {AppointmentDialogComponent} from "../booking/appointment-dialog/appointment-dialog.component";
import {TreatmentClassEditComponent} from "./treatment-class-edit/treatment-class-edit.component";
import {NzRadioButtonDirective, NzRadioComponent, NzRadioGroupComponent} from "ng-zorro-antd/radio";

@Component({
  selector: 'app-treatment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzDrawerModule,
    NzDatePickerComponent,
    FormFieldErrorsComponent,
    NzTableModule,
    NzInputGroupComponent,
    NzDividerComponent,
    CommonModule,
    NzIconDirective,
    NzInputDirective,
    NzModalModule,
    NzOptionComponent,
    NzSelectComponent,
    NzRadioButtonDirective,
    NzRadioComponent,
    NzRadioGroupComponent
  ],
  templateUrl: './treatment.component.html',
  styleUrl: './treatment.component.scss'
})
export class TreatmentComponent implements OnInit{
  itemForm: FormGroup | any;
  itemList: TreatmentItemDto[] = [];
  filteredItemList: TreatmentItemDto[] = [];
  editEnable: boolean = false;
  typeList:TreatmentItemTypeDto[] = [];
  selectedType: string ="";
  constructor(private fb: FormBuilder,
              private message: NzMessageService,
              private modal: NzModalService,
              private itemService: TreatmentItemService) {
  }

  ngOnInit() {
    this.loadItemList();
    this.loadAllTypes();

  }

  loadItemList() {
    this.itemService.getAllItems().subscribe({
        next: (data) => {
          // data.forEach(employee => this.itemList.push(employee))
          this.itemList = data;
          this.filteredItemList = [...data];
        },
        error: () => {
          this.message.error('加载项目信息失败')
        }
      }
    )
  }

  loadAllTypes() {
    this.itemService.getAllItemTypes().subscribe({
      next: (data) => {
        // data.forEach(employee => this.itemList.push(employee))
        this.typeList = data;
      },
      error: () => {
        this.message.error('加载分类')
      }
    })
  }

  selectType(type: TreatmentItemTypeDto) {
    this.selectedType = type.typeName;
    this.filteredItemList = this.itemList.filter(item =>
      item.classType.toLowerCase().includes(this.selectedType)
    );
  }

  search(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.filteredItemList = this.itemList.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  createNewItem() {
    this.createEmptyForm();
    this.editEnable = true;
  }

  editItem(item: TreatmentItemDto) {
    this.itemForm = this.fb.group({
      id: [item.id, Validators.required],
      name: [item.name, Validators.required],
      standardPrice: [item.standardPrice, Validators.required],
      itemNote: [item.itemNote || null],
      classType:[item.classType || null],
      active: [item.active]
    });
    this.editEnable = true
  }

  removeItem(itemId: string) {
    this.modal.confirm({
      nzTitle: '<i> 注意 </i>',
      nzContent: '<b>确定要删除此项目吗？</b>',
      nzOnOk: () => this.doRemoveItem(itemId)
    });

  }
  doRemoveItem(itemId:string){
    this.itemService.removeItem(itemId).subscribe({
      next: () => {
        this.message.success('删除成功');
        this.loadItemList();
      },
      error: (error) => {
        this.message.error('删除失败', error);
      }
    })
  }

  createEmptyForm() {
    this.itemForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      standardPrice: [null, Validators.required],
      itemNote: [null],
      classType: [null],
      active: [true]
    });
  }

  createNewType (){
    const modal = this.modal.create({
      nzTitle: '项目分类列表编辑',
      nzContent: TreatmentClassEditComponent,
      nzWidth: 600,
      nzFooter: null
  })
    modal.afterClose.subscribe(()=>{this.loadAllTypes()})
  }
  close(): void {
    this.editEnable = false;
  }

  save() {
    if (!!this.itemForm.valid) {
      if (!!this.itemForm.get('id').value) {
        this.itemService.updateItem(this.itemForm.get('id').value, this.itemForm.value).subscribe({
          next: () => {
            this.message.success('保存成功');
            this.editEnable = false;
            this.loadItemList();
          },
          error: (error) => {
            this.message.error('Error updating item', error);
          }
        })
      } else {
        this.itemService.createNewItem(this.itemForm.value).subscribe({
          next: () => {
            this.message.success('保存成功');
            this.editEnable = false;
            this.loadItemList();
          },
          error: (error) => {
            this.message.error('Error create item', error);
          }
        })
      }
    }
  }
}
