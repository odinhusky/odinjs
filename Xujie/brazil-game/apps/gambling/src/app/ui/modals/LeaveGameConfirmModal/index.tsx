import React from "react";
import { LeaveGameConfirmModal as CocoLeaveGameConfirmModal } from './env/u1'
import { LeaveGameConfirmModal as RioLeaveGameConfirmModal } from './env/u2'
import { LeaveGameConfirmModal as U5LeaveGameConfirmModal } from './env/u5'
import { LeaveGameConfirmModal as U6LeaveGameConfirmModal } from './env/u6'
import U7LeaveGameConfirmModal from './env/u7'

import { renderByUVersion } from "../../utils/renderByUVersion";
import {BaseModal} from "../BaseModal";

export interface ILeaveGameConfirmModalProps {
  onConfirm: (addFavorite: boolean) => void
  onClose: () => void
}

export const LeaveGameConfirmModal = (props: ILeaveGameConfirmModalProps) => {

  const {
    onClose,
    onConfirm
  } = props;

  return (
    <BaseModal>
      {
        renderByUVersion({
          "u1": (
            <CocoLeaveGameConfirmModal
              onConfirm={onConfirm}
              onClose={onClose}
            />
          ),
          "u2": (
            <RioLeaveGameConfirmModal
              onConfirm={onConfirm}
              onClose={onClose}
            />
          ),
          "u5": (
            <U5LeaveGameConfirmModal
              onConfirm={onConfirm}
              onClose={onClose}
            />
          ),
          "u6": (
            <U6LeaveGameConfirmModal
              onConfirm={onConfirm}
              onClose={onClose}
            />
          ),
          "u7": (
            <U7LeaveGameConfirmModal
              {...props}
            />
          )
        }, (
          <CocoLeaveGameConfirmModal
            onConfirm={onConfirm}
            onClose={onClose}
          />
        ))
      }
    </BaseModal>
  )
}
