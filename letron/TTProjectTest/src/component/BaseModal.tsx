import { ReactNode } from 'react';
import { View, Text,  Pressable, StyleSheet } from 'react-native';

// % Components
import { BaseIconBtn } from '@/component/BaseIconBtn';
import { BaseBtn } from '@/component/BaseBtn';


interface styleObjType {
  container?: object | undefined;
  header?: object | undefined;
  body?: object | undefined;
  footer?: object | undefined;
  mask?: object | undefined;
}

interface BaseModalProps {
  isOpen: boolean | undefined;
  cancelable: boolean | undefined;
  onClose?: () => void | undefined;
  onSubmit?: () => void | undefined;
  title?: string | undefined;
  isShowClose?: boolean | undefined;
  children: string | ReactNode;
  footerNode: ReactNode | undefined;
  styleObj?: styleObjType | undefined;
}

export const BaseModal = ({
  isOpen,
  cancelable,
  onClose,
  onSubmit,
  title,
  isShowClose,
  children,
  footerNode,
  styleObj
}: BaseModalProps) : JSX.Element => {

  return (
    <>
    {
      isOpen ? (
        <View>
          {/* Mask */}
          <Pressable />

          {/* Modal Container */}
          <View>
              {/* Header */}
              <View>
                <View>
                  <Text>{ title }</Text>
                </View>

                <View>
                  <BaseIconBtn name="close" onPress={() => {}} />
                </View>
              </View>

              {/* Body */}
              <View>
                { children }
              </View>

              {/* Footer */}
              <View>

              </View>
          </View>
        </View>
      ) : null
    }
   
    </>
  )
}

export default BaseModal;

const styles = StyleSheet.create({
  defaultImgStyle: {
    width: '100%',
    height: undefined,
  }
});