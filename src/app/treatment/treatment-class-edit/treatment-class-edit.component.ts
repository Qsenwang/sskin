import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormsModule} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {TreatmentItemService} from "../treatmentItem.service";
import {TreatmentItemTypeDto} from "@shared/sskinModel/sskinDto.model";
import {NzListModule} from "ng-zorro-antd/list";
import {CommonModule, NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {NzInputDirective} from "ng-zorro-antd/input";

@Component({
  selector: 'app-treatment-class-edit',
  standalone: true,
  imports: [
    NzListModule,
    FormsModule,
    CommonModule,
    NzButtonComponent,
    NzWaveDirective,
    NzRowDirective,
    NzColDirective,
    NzInputDirective
  ],
  templateUrl: './treatment-class-edit.component.html',
  styleUrl: './treatment-class-edit.component.scss'
})
export class TreatmentClassEditComponent implements OnInit {
  typesList: TreatmentItemTypeDto[] = [];

  constructor(private fb: FormBuilder,
              private message: NzMessageService,
              private modal: NzModalService,
              private itemService: TreatmentItemService) {
  }

  ngOnInit() {
    this.loadingTypes();
  }

  loadingTypes() {
    this.itemService.getAllItemTypes().subscribe({
      next: (data) => {
        // data.forEach(employee => this.itemList.push(employee))
        this.typesList = data;
      },
      error: () => {
        this.message.error('加载分类')
      }
    })
  }


  editIndex: number | null = null;
  originalItem: string = '';

  enableEdit(index: number): void {
    this.editIndex = index;
    this.originalItem = this.typesList[index].typeName;
  }

  saveEdit(index: number): void {
    this.editIndex = null;
    if (this.typesList[index].id) {
      this.itemService.updateType(this.typesList[index].id, this.typesList[index]).subscribe({
        next: (data) => {
          this.message.success('修改成功！');
          this.loadingTypes();
        },
        error: () => {
          this.message.error('修改失败')
        }
      })
    } else {
      this.itemService.addNewType(this.typesList[index]).subscribe({
        next: (data) => {
          this.message.success('添加成功！');
          this.loadingTypes();
        },
        error: () => {
          this.message.error('添加失败')
        }
      });
    }

  }

  cancelEdit(index: number): void {
    if (this.typesList[index].typeName === '') {
      // 如果是新添加的项，则取消时移除
      this.typesList.splice(index, 1);
    } else {
      // 如果是正在编辑的项，则恢复原始值
      this.typesList[index].typeName = this.originalItem;
    }
    this.editIndex = null;
  }

  addItem(): void {
    this.typesList.push({id: "", typeName: ''});
    this.editIndex = this.typesList.length - 1;
  }
}
