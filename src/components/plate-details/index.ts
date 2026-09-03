import type { Component } from 'vue'
import PetPlateContent from './PetPlateContent.vue'
import StudentPlateContent from './StudentPlateContent.vue'
import VehiclePlateContent from './VehiclePlateContent.vue'
import LostFoundPlateContent from './LostFoundPlateContent.vue'
import GenericPlateContent from './GenericPlateContent.vue'

/** 每种铭牌在这里注册自己的详情组件，避免 App.vue 出现类型条件堆叠。 */
const componentByType: Record<string, Component> = {
  PET: PetPlateContent,
  STUDENT: StudentPlateContent,
  VEHICLE: VehiclePlateContent,
  LOST_AND_FOUND: LostFoundPlateContent
}

export function detailComponentFor(type: string) {
  return componentByType[type] || GenericPlateContent
}
