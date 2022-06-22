<template>
    <Multiselect
        ref="multiselect"
        v-model="internalValue"
        class="input-multiselect"
        :style="{
            '--ms-max-height': content.maxDropdownHeight || '10rem',
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
        <template v-slot:placeholder>
            <wwElement
                class="multiselect-placeholder-el"
                v-bind="content.tagElement"
                :wwProps="{ text: placeholder }"
            />
        </template>
        <template v-slot:tag="{ option, handleTagRemove }">
            <div class="multiselect-tag" :style="option.style || defaultTagStyle">
                <wwElement
                    class="multiselect-tag-el"
                    v-bind="content.tagElementSelected"
                    :wwProps="{ text: option.label }"
                />
                <wwElement
                    v-if="!content.disabled"
                    @mousedown.prevent="isEditing ? null : handleTagRemove(option, $event)"
                    v-bind="content.iconElement"
                />
            </div>
        </template>
        <template v-if="content.mode === 'tags'" v-slot:option="{ option }">
            <wwElement class="multiselect-tag-el" v-bind="content.tagElement" :wwProps="{ text: option.label }" />
        </template>
    </Multiselect>
</template>

<script>
import Multiselect from '@vueform/multiselect';
// import Vueform from '@vueform/';

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
        const { value: currentSelection, setValue: setCurrentSelection } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'currentSelection',
            type: 'array',
            defaultValue: Array.isArray(props.content.initialValue) ? props.content.initialValue : [],
        });
        return { currentSelection, setCurrentSelection };
    },
    data: () => ({
        options: [],
        selection: [],
    }),
    created() {
        this.init();
    },
    computed: {
        internalValue: {
            get() {
                if (this.content.allowCreation) {
                    // we need to make available custom options before using them
                    for (const selection of this.currentSelection) {
                        if (!this.options.some(option => option.value === selection)) {
                            this.options.push(this.formatOption(selection));
                        }
                    }
                }

                return this.currentSelection;
            },
            set(value) {
                this.setCurrentSelection(value);
            },
        },
        placeholder() {
            return wwLib.wwLang.getText(this.content.placeholder);
        },
        defaultTagStyle() {
            return {
                backgroundColor: this.content.tagsDefaultBgColor,
                color: this.content.tagsDefaultTextColor,
            };
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
        isEditing() {
            this.handleOpening(this.content.isOpen);
        },
        'content.initialValue'() {
            this.init();
        },
        'content.options'() {
            this.init();
        },
        currentSelection(value) {
            this.$emit('trigger-event', { name: 'change', event: { domEvent: {}, value } });
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
        'content.isOpen'(value) {
            this.handleOpening(value);
        },
        /* wwEditor:end */
    },
    methods: {
        async init() {
            // reset selection and option to avoid mismatch
            this.internalValue = [];
            this.options = [];

            const initialOptions = Array.isArray(this.content.options) ? this.content.options : [];
            const initialValue = Array.isArray(this.content.initialValue) ? this.content.initialValue : [];

            this.options.push(...initialOptions.map(option => this.formatOption(option)));
            // add initial values as custom options if not already included
            this.options.push(
                ...initialValue.filter(selection => !this.options.map(option => option.value).includes(selection))
            );

            // await to avoid mismatch (multiselect not rendering custom tags)
            await this.$nextTick();

            this.internalValue = [...initialValue];
        },
        formatOption(option) {
            const labelField = this.content.labelField || DEFAULT_LABEL_FIELD;
            const valueField = this.content.valueField || DEFAULT_VALUE_FIELD;
            const bgColorField = this.content.bgColorField || DEFAULT_BG_COLOR_FIELD;
            const textColorField = this.content.textColorField || DEFAULT_TEXT_COLOR_FIELD;

            return typeof option === 'object'
                ? {
                      label: wwLib.wwLang.getText(wwLib.resolveObjectPropertyPath(option, labelField) || ''),
                      value: wwLib.resolveObjectPropertyPath(option, valueField),
                      style: {
                          backgroundColor:
                              wwLib.resolveObjectPropertyPath(option, bgColorField) || this.content.tagsDefaultBgColor,
                          color:
                              wwLib.resolveObjectPropertyPath(option, textColorField) ||
                              this.content.tagsDefaultTextColor,
                      },
                  }
                : {
                      // to allow flat array / option
                      label: option,
                      value: option,
                  };
        },
        handleOpening(value) {
            if (value) this.$refs.multiselect.open();
            else this.$refs.multiselect.close();
        },
        onTagSelected(isSelected) {
            if (isSelected) this.$refs.multiselect.open();
        },
    },
    mounted() {
        this.handleOpening(this.content.isOpen);
    },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style type="scss">
.input-multiselect {
    position: relative;
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
.multiselect-caret {
    margin-top: 10px;
    margin-bottom: 10px;
}
.multiselect-dropdown {
    max-height: unset;
}
.multiselect-placeholder-el {
    position: absolute !important;
    top: 50% !important;
    left: 0px !important;
    transform: translateY(-50%);
}
</style>
