<template>
    <Multiselect
        ref="multiselect"
        v-model="internalValue"
        class="input-multiselect"
        :style="cssVariables"
        :class="{ editing: isEditing }"
        :options="options"
        :close-on-select="content.closeOnSelect"
        :searchable="content.searchable"
        :mode="content.mode"
        :disabled="isReadOnly || content.disabled"
        :hideSelected="content.hideSelected"
        :placeholder="placeholder"
        :create-option="content.allowCreation"
        :canClear="content.clearIcon"
        :caret="content.caretIcon"
    >
        <!-- Placeholder -->
        <template v-slot:placeholder v-if="placeholder.length">
            <wwElement
                class="multiselect-placeholder-el"
                v-bind="content.placeholderElement"
                :wwProps="{ text: placeholder }"
                v-if="!isReadOnly"
            />
        </template>

        <!-- Tag selected with remove icon -->
        <template v-slot:tag="{ option, handleTagRemove }">
            <div class="multiselect-tag" :style="option.style || defaultTagStyle">
                <wwLayoutItemContext :index="option => getOptionIndex(option)" :item="{}" is-repeat :data="option">
                    <wwElement
                        class="multiselect-tag-el"
                        v-bind="content.tagElementSelected"
                        :wwProps="{ text: option.label }"
                    />
                    <wwElement
                        v-if="!isReadOnly"
                        @mousedown.prevent="isEditing ? null : handleTagRemove(option, $event)"
                        v-bind="content.removeTagIconElement"
                    />
                </wwLayoutItemContext>
            </div>
        </template>

        <!-- Tag unselected in list -->
        <template v-if="content.mode === 'tags'" v-slot:option="{ option }">
            <wwLayoutItemContext :index="option => getOptionIndex(option)" :item="{}" is-repeat :data="option">
                <wwElement class="multiselect-tag-el" v-bind="content.tagElement" :wwProps="{ text: option.label }" />
            </wwLayoutItemContext>
        </template>

        <!-- Small triangle displayed on the right of the input -->
        <template v-slot:caret>
            <wwElement v-bind="content.caretIconElement" v-if="!isReadOnly" />
        </template>

        <!-- Clear icon shown when the input has at least one selected options -->
        <template v-slot:clear="{ clear }">
            <wwElement
                v-bind="content.clearIconElement"
                @mousedown.prevent="isEditing ? null : clear($event)"
                v-if="!isReadOnly"
            />
        </template>
    </Multiselect>
</template>

<script>
import Multiselect from '@vueform/multiselect';

const DEFAULT_LABEL_FIELD = 'label';
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_TEXT_COLOR_FIELD = 'textColor';
const DEFAULT_BG_COLOR_FIELD = 'bgColor';

export default {
    components: { Multiselect },
    emits: ['trigger-event', 'update:content:effect'],
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
        wwElementState: { type: Object, required: true },
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
    }),
    created() {
        this.init();
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
        getOptionIndex(option) {
            return this.options.indexOf(option);
        },
        defaultTagStyle() {
            return {
                backgroundColor: this.content.tagsDefaultBgColor,
                color: this.content.tagsDefaultTextColor,
            };
        },
        cssVariables() {
            return {
                '--ms-dropdown-bg': this.content.dropdownBackgroundColor,
                '--ms-dropdown-border-width': this.content.dropdownBorderWidth,
                '--ms-dropdown-border-color': this.content.dropdownBorderColor,
                '--ms-dropdown-radius': this.content.dropdownBorderRadius,
                '--ms-max-height': this.content.dropdownMaxHeight || '10rem',
                '--ms-option-bg-pointed': this.content.optionBackgroundPointed,
            };
        },
        isReadOnly() {
            /* wwEditor:start */
            if (this.wwEditorState.isSelected) {
                return this.wwElementState.states.includes('readonly');
            }
            /* wwEditor:end */
            return this.wwElementState.props.readonly === undefined
                ? this.content.readonly
                : this.wwElementState.props.readonly;
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
    --ms-border-width: 0px;

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
