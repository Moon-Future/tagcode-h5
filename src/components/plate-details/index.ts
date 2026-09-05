import type { Component } from 'vue'
import PetPlateContent from './PetPlateContent.vue'
import StudentPlateContent from './StudentPlateContent.vue'
import VehiclePlateContent from './VehiclePlateContent.vue'
import LostFoundPlateContent from './LostFoundPlateContent.vue'
import InstructionPlateContent from './InstructionPlateContent.vue'
import MemorialPlateContent from './MemorialPlateContent.vue'
import CustomPlateContent from './CustomPlateContent.vue'
import GenericPlateContent from './GenericPlateContent.vue'

/** 每种铭牌在这里注册自己的详情组件，避免 App.vue 出现类型条件堆叠。 */
const componentByType: Record<string, Component> = {
  PET: PetPlateContent,
  STUDENT: StudentPlateContent,
  VEHICLE: VehiclePlateContent,
  LOST_AND_FOUND: LostFoundPlateContent,
  INSTRUCTION: InstructionPlateContent,
  MEMORIAL: MemorialPlateContent,
  CUSTOM: CustomPlateContent
}

export function detailComponentFor(type: string) {
  return componentByType[type] || GenericPlateContent
}
