<template>
    <Multiselect
        v-model="internalValue"
        class="input-multiselect"
        :style="{
            '--font-size': content.fontSize || '16px',
            '--ms-max-height': content.maxDropdownHeight || '10rem'
        }"
        :class="{ editing: isEditing }"
        :options="options"
        :close-on-select="content.closeOnSelect"
        :searchable="content.searchable"
        :mode="content.mode"
        :disabled="content.disabled"
        :hideSelected="content.hideSelected"
        :placeholder="placeholder"
        :create-option="content.allowCreation"
    >
        <template v-slot:tag="{ option, handleTagRemove }">
            <div class="multiselect-tag" :style="option.style || defaultTagStyle">
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
            <span class="multiselect-tag" :style="option.style || defaultTagStyle">{{ option.label }}</span>
        </template>
    </Multiselect>
</template>

<script>
import Multiselect from '@vueform/multiselect';

const DEFAULT_LABEL_FIELD = 'label';
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_BG_COLOR_FIELD = 'bgColor';
const DEFAULT_TEXT_COLOR_FIELD = 'textColor';

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
        const { value: variableValue, setValue: setVariableValue } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'currentSelection',
            defaultValue: props.content.initialValue,
            sanitizer: value => Array.isArray(value) ? value : []
        });
        return { variableValue, setVariableValue };
    },
    data: () => ({
        options: [],
        selection: []
    }),
    created() {
        this.init()
    },
    computed: {
        internalValue: {
            get() {
                return this.variableValue
            },
            set(value) {
                const { newValue, hasChanged } = this.setVariableValue(value)
                if (hasChanged) {
                    this.$emit('trigger-event', { name: 'change', event: { value: newValue } });
                }
            }
        },
        placeholder() {
            return wwLib.wwLang.getText(this.content.placeholder)
        },
        defaultTagStyle() {
            return {
                backgroundColor: this.content.tagsDefaultBgColor,
                color: this.content.tagsDefaultTextColor,
            }
        },
        isEditing() {
            /* wwEditor:start */
            return this.wwEditorState.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
            /* wwEditor:end */
            // eslint-disable-next-line no-unreachable
            return false;
        },
    },
    watch: {
        'content.initialValue'() {
            this.init()
        },
        'content.options'() {
            this.init()
        },
        /* wwEditor:start */
        'wwEditorState.boundProps.options'(isBind) {
            if (!isBind)
                this.$emit('update:content:effect', {
                    labelField: null,
                    valueField: null,
                    bgColorField: null,
                    textColorField: null,
                });
        },
        /* wwEditor:end */
    },
    methods: {
        async init() {
            // reset selection and option to avoid mismatch
            this.internalValue = []
            this.options = []

            const initialOptions = Array.isArray(this.content.options) ? this.content.options : []
            const initialValue = Array.isArray(this.content.initialValue) ? this.content.initialValue : []

            this.options.push(...initialOptions.map(option => this.formatOption(option)))
            // add initial values as custom options if not already included
            this.options.push(...initialValue.filter(selection => !this.options.map(option => option.value).includes(selection)))

            // await to avoid mismatch (multiselect not rendering custom tags)
            await this.$nextTick()

            this.internalValue = [...initialValue]
        },
        formatOption(option) {
            const labelField = this.content.labelField || DEFAULT_LABEL_FIELD;
            const valueField = this.content.valueField || DEFAULT_VALUE_FIELD;
            const bgColorField = this.content.bgColorField || DEFAULT_BG_COLOR_FIELD;
            const textColorField = this.content.textColorField || DEFAULT_TEXT_COLOR_FIELD;

            return typeof option === 'object' ?
                {
                    label: wwLib.wwLang.getText(wwLib.resolveObjectPropertyPath(option, labelField) || ''),
                    value: wwLib.resolveObjectPropertyPath(option, valueField),
                    style: {
                        backgroundColor: wwLib.resolveObjectPropertyPath(option, bgColorField) || this.content.tagsDefaultBgColor,
                        color: wwLib.resolveObjectPropertyPath(option, textColorField) || this.content.tagsDefaultTextColor,
                    },
                } : { // to allow flat array / option
                    label: option,
                    value: option
                } 
        },
    }
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style type="scss">
.input-multiselect {
    --ms-font-size: var(--font-size);
    --ms-option-font-size: var(--font-size);
    --ms-tag-font-size: var(--font-size);
    --ms-line-height: auto;
    --ms-tag-line-height: auto;

    min-height: calc(var(--font-size) + 20px);

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
.multiselect.is-active {
    box-shadow: unset;
}

.multiselect-caret,
.multiselect-clear-icon,
.multiselect-tag-remove-icon {
    width: var(--font-size);
    height: var(--font-size);
}
.multiselect-caret {
    margin-top: 10px;
    margin-bottom: 10px;
}
.multiselect-dropdown {
    max-height: unset;
}
</style>
