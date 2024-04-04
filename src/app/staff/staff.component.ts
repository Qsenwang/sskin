import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {ActivatedRoute} from "@angular/router";
import {StaffService} from "./staff.service";
import {StaffDto} from "@shared/sskinModel/sskinDto.model";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzDatePickerComponent} from "ng-zorro-antd/date-picker";
import {FormFieldErrorsComponent} from "@shared/form-field-errors/form-field-errors.component";
import {CommonModule} from "@angular/common";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-staff',
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
    NzModalModule
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit {
  staffForm: FormGroup | any;
  staffList: StaffDto[] = [];
  filteredStaffList: StaffDto[] = [];
  editEnable: boolean = false;
  constructor(private fb: FormBuilder,
              private message: NzMessageService,
              private modal: NzModalService,
              private staffService: StaffService) {}

  ngOnInit() {
    this.loadStaffList();
  }

  loadStaffList() {
    this.staffService.getAllStaff().subscribe({
        next: (data) => {
          // data.forEach(employee => this.staffList.push(employee))
          this.staffList = data;
          this.filteredStaffList= [...data];
        },
        error: () => {
          this.message.error('加载员工信息失败')
        }
      }
    )
  }

  search(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.filteredStaffList = this.staffList.filter(empoyee =>
      empoyee.name.toLowerCase().includes(query.toLowerCase())
    );
  }
  createNewStaff(){
    this.createEmptyForm();
    this.editEnable = true;
  }

  editStaff(staff: StaffDto) {
    this.staffForm = this.fb.group({
      id: [staff.id, Validators.required],
      name: [staff.name, Validators.required],
      onBoardDate: [staff.onBoardDate, Validators.required],
      offBoardDate: [staff.offBoardDate || null],
      active: [staff.active]
    });
    this.editEnable = true
  }

  removeStaff(staffId:string) {

    this.modal.confirm({
      nzTitle: '<i> 注意 </i>',
      nzContent: '<b>确定要删除此员工吗？</b>',
      nzOnOk: () => this.doRemoveStaff(staffId)
    });
  }

  doRemoveStaff(staffId: string) {
    this.staffService.removeStaff(staffId).subscribe({
      next: ()=>{
        this.message.success('删除成功');
        this.loadStaffList();
      },
      error:(error)=>{
        this.message.error('删除失败', error);
      }
    })
  }

  createEmptyForm(){
    this.staffForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      onBoardDate: [null, Validators.required],
      offBoardDate: [null],
      active: [true]
    });
  }
  close(): void {
    this.editEnable = false;
  }

  save() {
    if(!!this.staffForm.valid){
      if(!!this.staffForm.get('id').value){
        this.staffService.updateStaff(this.staffForm.get('id').value, this.staffForm.value).subscribe({
          next: ()=>{
            this.message.success('保存成功');
            this.editEnable=false;
            this.loadStaffList();
          },
          error:(error)=>{
            this.message.error('Error updating staff', error);
          }
        })
      }
      else {
        this.staffService.createNewStaff(this.staffForm.value).subscribe({
          next: ()=>{
            this.message.success('保存成功');
            this.editEnable=false;
            this.loadStaffList();
          },
          error:(error)=>{
            this.message.error('Error create staff', error);
          }
        })
      }
    }
  }
}
