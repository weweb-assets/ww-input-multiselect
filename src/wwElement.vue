<template>
    <Multiselect
        ref="multiselect"
        v-model="internalValue"
        :key="componentKey"
        class="input-multiselect"
        :style="cssVariables"
        :class="{ editing: isEditing }"
        v-bind="multiselectProps"
    >
        <!-- Placeholder -->
        <template v-slot:placeholder>
            <wwElement
                class="multiselect-placeholder-el"
                v-bind="content.placeholderElement"
                :wwProps="{ text: placeholder || '' }"
            />
        </template>

        <!-- Tag selected with remove icon -->
        <template v-slot:tag="{ option, handleTagRemove }">
            <div class="multiselect-tag" :style="option.style || defaultTagStyle">
                <wwLayoutItemContext :index="getOptionIndex(option)" :item="{}" is-repeat :data="option">
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
            <wwLayoutItemContext :index="getOptionIndex(option)" :item="{}" is-repeat :data="option">
                <OptionItem :option="option" :tagElement="content.tagElement" />
            </wwLayoutItemContext>
        </template>

        <!-- Small triangle displayed on the right of the input -->
        <template v-slot:caret v-if="!isReadOnly">
            <wwElement v-bind="content.caretIconElement" />
        </template>

        <!-- Clear icon shown when the input has at least one selected options -->
        <template v-slot:clear="{ clear }">
            <wwElement v-bind="content.clearIconElement" @mousedown.prevent="isEditing ? null : clear($event)" />
        </template>
    </Multiselect>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import { computed } from 'vue';
import OptionItem from './OptionItem.vue';

const DEFAULT_LABEL_FIELD = 'label';
const DEFAULT_VALUE_FIELD = 'value';
const DEFAULT_TEXT_COLOR_FIELD = 'textColor';
const DEFAULT_BG_COLOR_FIELD = 'bgColor';

export default {
    components: { Multiselect, OptionItem },
    emits: ['trigger-event', 'update:content:effect', 'add-state', 'remove-state'],
    props: {
        uid: { type: String, required: true },
        content: { type: Object, required: true },
        /* wwEditor:start */
        wwEditorState: { type: Object, required: true },
        /* wwEditor:end */
        wwElementState: { type: Object, required: true },
    },
    setup(props, { emit }) {
        const { value: currentSelection, setValue: setCurrentSelection } = wwLib.wwVariable.useComponentVariable({
            uid: props.uid,
            name: 'currentSelection',
            type: 'array',
            defaultValue: computed(() => (Array.isArray(props.content.initialValue) ? props.content.initialValue : [])),
        });
        return { currentSelection, setCurrentSelection };
    },
    data: () => ({
        options: [],
        componentKey: 0,
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
        multiselectProps() {
            return {
                options: this.options,
                closeOnSelect: this.content.closeOnSelect,
                searchable: this.content.searchable,
                mode: this.content.mode,
                disabled: this.isReadOnly || this.content.disabled,
                required: this.content.required,
                hideSelected: this.content.hideSelected,
                placeholder: 'placeholder',
                createOption: this.content.allowCreation,
                canClear: this.content.clearIcon && !this.isReadOnly,
                caret: this.content.caretIcon && !this.isReadOnly,
                name: this.wwElementState.name,
                infinite: this.content.infiniteScroll,
                limit: this.content.limitedOptions ? this.content.limit : -1,
                resolveOnLoad: false,
            };
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
                return Array.isArray(this.currentSelection) ? this.currentSelection : [];
            },
            set(newValue, oldValue) {
                if (newValue === oldValue) return;
                this.setCurrentSelection(newValue);
                this.$emit('trigger-event', { name: 'change', event: { domEvent: {}, value: newValue } });
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
        cssVariables() {
            return {
                '--ms-dropdown-bg': this.content.dropdownBackgroundColor,
                '--ms-dropdown-border-width': this.content.dropdownBorderWidth,
                '--ms-dropdown-border-color': this.content.dropdownBorderColor,
                '--ms-dropdown-radius': this.content.dropdownBorderRadius,
                '--ms-max-height': this.content.dropdownMaxHeight || '10rem',
                '--ms-option-bg-pointed': this.content.optionBackgroundPointed,
                '--ms-bg-disabled': this.isReadOnly ? 'transparent' : null,
                '--ms-bg': 'transparent',
                '--ms-radius': '0',
                '--ms-spinner-color': this.content.loadingRingColor,
                '--search-font-size': this.content.searchFontSize || 'inherit',
                '--search-font-family': this.content.searchFontFamily || 'inherit',
                '--search-font-color': this.content.searchFontColor || 'inherit',
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
            this.refreshInitialValue();
            this.$emit('trigger-event', { name: 'initValueChange', event: { value: this.content.initialValue } });
        },
        'content.options'() {
            this.componentKey += 1;
            this.$nextTick(() => {
                this.init();
                this.refreshOptions();
            });
        },
        'content.labelField'() {
            this.refreshOptions();
        },
        'content.valueField'() {
            this.refreshOptions();
        },
        'content.bgColorField'() {
            this.refreshOptions();
        },
        'content.textColorField'() {
            this.refreshOptions();
        },
        isReadOnly: {
            immediate: true,
            handler(value) {
                if (value) {
                    this.$emit('add-state', 'readonly');
                } else {
                    this.$emit('remove-state', 'readonly');
                }
            },
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
        'content.infiniteScroll'(value) {
            if (value) {
                this.$emit('update:content:effect', { limitedOptions: true });
            }

            this.componentKey += 1;
            this.$nextTick(() => {
                this.init();
            });
        },
        'content.limitedOptions'(value) {
            if (!value) {
                this.$emit('update:content:effect', { infiniteScroll: false });
            }

            this.componentKey += 1;
            this.$nextTick(() => {
                this.init();
            });
        },
        /* wwEditor:end */
    },
    methods: {
        init() {
            const initialOptions = Array.isArray(this.content.options) ? [...this.content.options] : [];
            this.options.push(...initialOptions.map(option => this.formatOption(option)));

            if (this.content.initialValue !== undefined) {
                // add initial values as custom options if not already included
                const initialValue = Array.isArray(this.content.initialValue) ? [...this.content.initialValue] : [];
                this.options.push(
                    ...initialValue.filter(selection => !this.options.map(option => option.value).includes(selection))
                );
                // We set internalValue after the options to avoid mismatch
                this.internalValue = initialValue;
            }
        },
        /**
         * We need to avoid to have a value not present in options
         * So here we take care of not removing an used option
         */
        refreshOptions() {
            // we removed unused options
            this.options = this.options.filter(option => this.internalValue.includes(option.value));
            // Then we add the new initial options and avoid duplicate
            const initialOptions = Array.isArray(this.content.options) ? [...this.content.options] : [];
            const newOptions = initialOptions.filter(
                option => !this.options.some(currentOpt => currentOpt.value === option.value)
            );
            this.options.push(...newOptions.map(option => this.formatOption(option)));
            // Then we add current selection as custom options if not already included
            this.options.push(
                ...this.internalValue.filter(selection => !this.options.map(option => option.value).includes(selection))
            );
        },
        refreshInitialValue() {
            const initialValue = Array.isArray(this.content.initialValue) ? [...this.content.initialValue] : [];
            this.options.push(
                ...initialValue.filter(selection => !this.options.map(option => option.value).includes(selection))
            );

            this.setCurrentSelection(initialValue);
        },
        formatOption(option) {
            const labelField = this.content.labelField || DEFAULT_LABEL_FIELD;
            const valueField = this.content.valueField || DEFAULT_VALUE_FIELD;
            const bgColorField = this.content.bgColorField || DEFAULT_BG_COLOR_FIELD;
            const textColorField = this.content.textColorField || DEFAULT_TEXT_COLOR_FIELD;

            return typeof option === 'object'
                ? {
                      label: wwLib.wwLang.getText(wwLib.resolveObjectPropertyPath(option, labelField)),
                      value: wwLib.resolveObjectPropertyPath(option, valueField),
                      style: {
                          backgroundColor:
                              wwLib.resolveObjectPropertyPath(option, bgColorField) || this.content.tagsDefaultBgColor,
                          color:
                              wwLib.resolveObjectPropertyPath(option, textColorField) ||
                              this.content.tagsDefaultTextColor,
                      },
                      data: option,
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
        getOptionIndex(option) {
            return this.options.indexOf(option);
        },
    },
    mounted() {
        this.handleOpening(this.content.isOpen);
    },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style type="scss" scoped>
.input-multiselect {
    --ms-border-width: 0px;

    position: relative;
    min-height: calc(var(--font-size) + 20px);

    &.is-active {
        box-shadow: unset;
    }

    /* wwEditor:start */
    &.editing {
        pointer-events: none;
    }
    /* wwEditor:end */
}
.input-multiselect::v-deep .multiselect-wrapper {
    height: inherit;
    min-height: unset;
}
.input-multiselect::v-deep .multiselect-tag {
    padding: 4px;
    border-radius: 4px;
}
.input-multiselect::v-deep .multiselect-tags-search {
    background-color: transparent;
    font-size: var(--search-font-size);
    font-family: var(--search-font-family);
    color: var(--search-font-color);
}
.input-multiselect::v-deep .multiselect-caret {
    margin-top: 10px;
    margin-bottom: 10px;
}
.input-multiselect::v-deep .multiselect-placeholder-el {
    position: absolute !important;
    top: 50% !important;
    left: 0px !important;
    transform: translateY(-50%);
}

/* wwEditor:start */
.input-multiselect:not(.editing)::v-deep .multiselect-placeholder-el {
    pointer-events: none;
}
/* wwEditor:end */
/* wwFront:start */
.input-multiselect::v-deep .multiselect-placeholder-el {
    pointer-events: none;
}
/* wwFront:end */
</style>
