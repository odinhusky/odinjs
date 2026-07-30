<template>
  <q-form @submit="onSubmit">
    <div class="form-area">
      <template v-for="item in dialogForm" :key="item.key">
        <div class="item">
          <div class="label q-mb-xs">{{ item.label }}</div>
          <q-input
            v-if="item.inputType === 'input'"
            v-model="item.value"
            :type="item.type"
            autocomplete="off"
            outlined
          />
          <q-select
            v-else-if="item.inputType === 'select'"
            v-model="item.value"
            :options="item.options"
            dense
            outlined
          />
          <q-option-group
            v-else-if="item.inputType === 'checkbox'"
            v-model="item.value"
            :options="item.options"
            type="checkbox"
            color="primary"
            dense
          />
          <slot v-else-if="item.inputType === 'custom'" :name="`${item.key}`" :item="item"></slot>
        </div>
      </template>
      <div class="footer">
        <q-btn v-close-popup type="submit" label="確定" class="button-submit col-5" />
        <q-btn v-close-popup type="reset" outline label="取消" class="button-cancel col-5" />
      </div>
    </div>
  </q-form>
</template>

<script>
  export default {
    props: {
      dialogForm: Object
    },
    setup(props) {
      const onSubmit = () => {
        console.log("Form submitted with dialogForm:", JSON.parse(JSON.stringify(props.dialogForm)))
        onReset()
      }

      const onReset = () => {
        props.dialogForm.forEach((item) => {
          if (item.inputType === "checkbox") {
            // Initialize as an array if it's a checkbox group
            item.value = []
          } else {
            item.value = null
          }
        })
      }

      return {
        onSubmit,
        onReset
      }
    }
  }
</script>

<style type="scss" scoped>
  .form-area {
    width: 300px;
    padding: 18px 32px;
  }

  @media (min-width: 600px) {
    .form-area {
      width: 500px;
    }
  }

  .form-area .item {
    margin-bottom: 16px;
    width: 100%;
  }

  .form-area .label {
    color: black;
    font-weight: 600;
  }

  .form-area .footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-area .footer .button-submit {
    background: #0d0df8;
    color: white;
    border-radius: 8px;
  }

  .form-area .footer .button-cancel {
    border: 1px solid #0d0df8;
    color: #0d0df8;
    border-radius: 8px;
  }
</style>
