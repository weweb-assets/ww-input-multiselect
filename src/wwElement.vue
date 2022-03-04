<template>
  <div class="input-multiselect" :class="{ editing: isEditing }">
    <Multiselect
      v-model="internalValue"
      :options="selectOptions"
      :close-on-select="content.closeOnSelect"
      :searchable="content.searchable"
      :mode="content.mode"
      :disabled="content.disabled"
      :hideSelected="content.hideSelected"
    >
      <template v-slot:tag="{ option, handleTagRemove }">
        <div class="multiselect-tag" :style="option.style">
          {{ option.label }}
          <span
            v-if="!content.disabled"
            class="multiselect-tag-remove"
            @mousedown.prevent="handleTagRemove(option, $event)"
          >
            <span class="multiselect-tag-remove-icon"></span>
          </span>
        </div>
      </template>
      <template v-if="content.mode === 'tags'" v-slot:option="{ option }">
        <span class="multiselect-tag" :style="option.style">{{ option.label }}</span>
      </template>
    </Multiselect>
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect'

const DEFAULT_LABEL_FIELD = 'label'
const DEFAULT_VALUE_FIELD = 'value'
const DEFAULT_BG_COLOR_FIELD = 'bgColor'
const DEFAULT_TEXT_COLOR_FIELD = 'textColor'

export default {
  components: { Multiselect },
  emits: ['trigger-event', 'update:content:effect'],
  props: {
    uid: { type: String, required: true },
    content: { type: Object, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  setup(props) {
    const { value: currentSelection, setValue: setCurrentSelection } = wwLib.wwVariable.useComponentVariable(
        props.uid,
        'currentSelection',
        props.content.initialValue
    );
    return { currentSelection, setCurrentSelection };
  },
  computed: {
    isEditing() {
      /* wwEditor:start */
      return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
      /* wwEditor:end */
      // eslint-disable-next-line no-unreachable
      return false;
    },
    internalValue: {
      get() {
        return Array.isArray(this.currentSelection) ? this.currentSelection : []
      },
      set(value) {
        this.setCurrentSelection(value)
      }
    },
    selectOptions() {
      const labelField = this.content.labelField || DEFAULT_LABEL_FIELD
      const valueField = this.content.valueField || DEFAULT_VALUE_FIELD
      const bgColorField = this.content.bgColorField || DEFAULT_BG_COLOR_FIELD
      const textColorField = this.content.textColorField || DEFAULT_TEXT_COLOR_FIELD

      if (!Array.isArray(this.content.options)) return []

      return this.content.options.map(option => {
        return typeof option === 'object' ? {
          label: wwLib.wwManagerLang.getText(option[labelField]), 
          value: option[valueField],
          style: {
            backgroundColor: option[bgColorField] || this.content.tagsDefaultBgColor,
            color: option[textColorField] || this.content.tagsDefaultTextColor
          }
        } : { // to allow flat array
          label: option, 
          value: option,
          style: {
            backgroundColor: this.content.tagsDefaultBgColor,
            color: this.content.tagsDefaultTextColor
          }
        }
      })
    },
  },
  watch: {
    'content.initialValue'(value) {
      this.setCurrentSelection(value)
    },
    currentSelection(value, oldValue) {
      this.$emit('trigger-event', { name: 'change', event: { value } });
    },
    /* wwEditor:start */
    'wwEditorState.boundProps.options'(isBind) {
        if (!isBind) this.$emit('update:content:effect', { displayField: null, valueField: null, bgColorField: null, textColorField: null });
    },
    selectOptions() {
      // multi select breaks when selection and available options mismatch
      this.setCurrentSelection([])
    }
    /* wwEditor:end */
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style type="scss">
.input-multiselect {
  /* wwEditor:start */
  &.editing {
    pointer-events: none;
  }
  /* wwEditor:end */
}
.multiselect-tag {
  padding: 4px;
  border-radius: 4px;
}
</style>