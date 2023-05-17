export default {
    editor: {
        label: {
            en: 'Input multiselect',
            fr: 'Champs sélection multiple',
        },
        icon: 'select',
        customStylePropertiesOrder: [
            ['tagsDefaultBgColor', 'tagsDefaultTextColor'],
            [
                'dropdownBackgroundColor',
                'optionBackgroundPointed',
                'dropdownBorderWidth',
                'dropdownBorderColor',
                'dropdownBorderRadius',
                'dropdownMaxHeight',
            ],
            ['searchFontFamily', 'searchFontSize', 'searchFontColor'],
        ],
        customSettingsPropertiesOrder: [
            'isOpen',
            [
                'openInEditor',
                'layoutType',
                'initialValue',
                'options',
                'hintFields',
                'labelField',
                'valueField',
                'textColorField',
                'bgColorField',
            ],
            ['placeholder'],
            ['disabled', 'readonly', 'mode', 'allowCreation', 'hideSelected', 'searchable', 'closeOnSelect'],
            ['clearIcon', 'caretIcon'],
        ],
    },
    options: {
        noBorderRadiusClipping: true,
    },
    triggerEvents: [
        { name: 'change', label: { en: 'On change' }, event: { value: [] }, default: true },
        { name: 'initValueChange', label: { en: 'On init value change' }, event: { value: '' } },
    ],
    properties: {
        openInEditor: {
            type: 'OnOff',
            label: {
                en: 'Force open in editor',
            },
            editorOnly: true,
            defaultValue: false,
            section: 'settings',
            hidden: content => content.readonly || content.disabled,
        },
        layoutType: {
            label: {
                en: 'Layout type',
            },
            type: 'TextSelect',
            options: {
                options: [
                    { value: 'text', label: { en: 'Text' } },
                    { value: 'free', label: { en: 'Free layout' } },
                ],
            },
            defaultValue: 'text',
            section: 'settings',
        },
        placeholder: {
            label: {
                en: 'Placeholder',
                fr: 'Texte par défaut',
            },
            type: 'Text',
            defaultValue: { en: 'placeholder' },
            section: 'settings',
            bindable: true,
            multiLang: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'A string that defines the placeholder: `"My option"`',
            },
            /* wwEditor:end */
        },
        disabled: {
            label: {
                en: 'Disabled',
                fr: 'Désactivé',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'A boolean that defines if the input is disabled: `true | false`',
            },
            /* wwEditor:end */
        },
        readonly: {
            label: {
                en: 'Read Only',
                fr: 'Read Only',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
            bindable: true,
            hidden: (content, sidePanelContent, boundProps, wwProps) => !!(wwProps && wwProps.readonly !== undefined),
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'A boolean that defines if the input is readonly: `true | false`',
            },
            /* wwEditor:end */
        },
        mode: {
            label: {
                en: 'Mode',
                fr: 'Mode',
            },
            type: 'TextSelect',
            defaultValue: 'tags',
            options: {
                options: [
                    { label: 'Tags', value: 'tags' },
                    { label: 'Counter', value: 'multiple' },
                ],
            },
            section: 'settings',
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'A string that defines mode: `"tags" | "multiple"`',
            },
            /* wwEditor:end */
        },
        advanced: {
            type: 'OnOff',
            label: {
                en: 'Advanced options',
            },
            defaultValue: false,
            section: 'settings',
        },
        allowCreation: {
            hidden: content => !content.advanced,
            label: {
                en: 'Allow to create option',
                fr: "Permettre la création d'option",
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'boolean',
                tooltip: 'A boolean that defines if the user can create options: `true | false`',
            },
            /* wwEditor:end */
        },
        hideSelected: {
            hidden: content => !content.advanced,
            label: {
                en: 'Hide selected elements',
                fr: 'Cacher les éléments sélectionnés',
            },
            type: 'OnOff',
            defaultValue: true,
            section: 'settings',
        },
        searchable: {
            hidden: content => !content.advanced,
            label: {
                en: 'Searchable',
                fr: 'Recherche',
            },
            type: 'OnOff',
            defaultValue: true,
            section: 'settings',
        },
        searchFontFamily: {
            label: {
                en: 'Search font family',
            },
            type: 'FontFamily',
            responsive: true,
            states: true,
            hidden: content => !content.searchable,
        },
        searchFontSize: {
            label: {
                en: 'Search font size',
            },
            type: 'Length',
            options: {
                unitChoices: [
                    { value: 'px', label: 'px', min: 1, max: 100 },
                    { value: 'em', label: 'em', min: 1, max: 10, digits: 2 },
                    { value: 'rem', label: 'rem', min: 1, max: 10, digits: 2 },
                ],
            },
            responsive: true,
            states: true,
            hidden: content => !content.searchable,
        },
        searchFontColor: {
            label: {
                en: 'Search font color',
            },
            type: 'Color',
            options: {
                nullable: true,
            },
            bindable: true,
            responsive: true,
            states: true,
            hidden: content => !content.searchable,
        },
        closeOnSelect: {
            hidden: content => !content.advanced,
            label: {
                en: 'Close on select',
                fr: 'Ferme à la sélection',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        infiniteScroll: {
            hidden: content => !content.advanced,
            label: {
                en: 'Infinite scroll',
                fr: 'Scroll infini',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        loadingRingColor: {
            hidden: content => !content.advanced || !content.infiniteScroll,
            label: {
                en: 'Loading ring color',
            },
            type: 'Color',
            defaultValue: '#099af2',
            section: 'settings',
        },
        limitedOptions: {
            hidden: content => !content.advanced,
            label: {
                en: 'Limited options',
                fr: 'Options limitées',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        limit: {
            hidden: content => !content.advanced || !content.limitedOptions,
            type: 'Number',
            label: {
                en: 'Limit',
                fr: 'Limite',
            },
            options: {
                min: 10,
                max: 50,
                step: 1,
            },
            defaultValue: 20,
            section: 'settings',
        },
        clearIcon: {
            label: {
                en: 'Clear icon',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        caretIcon: {
            label: {
                en: 'Caret icon',
            },
            type: 'OnOff',
            defaultValue: true,
            section: 'settings',
        },
        initialValue: {
            label: {
                en: 'Initial value',
                fr: 'Valeur initiale',
            },
            type: 'Array',
            options: {
                item: {
                    type: 'Generic',
                },
            },
            bindable: true,
            section: 'settings',
            /* wwEditor:start */
            bindingValidation: {
                type: 'string',
                tooltip: 'A string that defines if the input initial value: `my option`',
            },
            /* wwEditor:end */
        },
        options: {
            label: { en: 'Options', fr: 'Options' },
            type: 'Array',
            section: 'settings',
            options: {
                item: {
                    type: 'Object',
                    defaultValue: { label: 'New option', value: '' },
                    options: {
                        item: {
                            label: {
                                label: { en: 'Label' },
                                type: 'Text',
                                options: { placeholder: 'Label' },
                                multiLang: true,
                            },
                            value: {
                                label: { en: 'Value' },
                                type: 'Text',
                                options: { placeholder: 'Value' },
                            },
                        },
                    },
                },
            },
            defaultValue: [
                { value: 'option', label: { en: 'option - 1' } },
                { value: 'option2', label: { en: 'option - 2' } },
            ],
            bindable: true,
            /* wwEditor:start */
            bindingValidation: {
                type: 'array',
                tooltip:
                    'A collection of data in array format: \n\n `[{}, {}, ...] || ["string1", "string2", ...] || [1, 2, ...]`',
            },
            /* wwEditor:end */
        },
        hintFields: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || content.options,
            label: {
                en: 'Options fields',
                fr: 'Champs des options',
            },
            type: 'Info',
            options: {
                text: { en: 'Please provide at least one option to configure fields' },
            },
            editorOnly: true,
            section: 'settings',
        },
        labelField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
            label: {
                en: 'Label field',
                fr: 'Label field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: null,
            section: 'settings',
        },
        valueField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
            label: {
                en: 'Value field',
                fr: 'Value field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: null,
            section: 'settings',
        },
        /**
         * DEPRECATED FIELD
         */
        bgColorField: {
            hidden: true,
            label: {
                en: 'Background color field',
                fr: 'Background color field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: null,
            section: 'settings',
        },
        /**
         * DEPRECATED FIELD
         */
        textColorField: {
            hidden: true,
            label: {
                en: 'Text color field',
                fr: 'Text color field',
            },
            type: 'ObjectPropertyPath',
            options: content => {
                if (!content.options.length || typeof content.options[0] !== 'object') {
                    return null;
                }

                return { object: content.options[0] };
            },
            defaultValue: null,
            section: 'settings',
        },
        placeholderElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-text',
                state: {
                    name: 'Placeholder text',
                    style: {
                        default: {
                            color: '#D1D5DB',
                            padding: '0px 0px 0px 12px',
                        },
                    },
                },
            },
            navigator: {
                group: 'Multiselect',
            },
        },
        tagElementSelected: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-text',
                state: {
                    name: 'Text - selected',
                    style: {
                        default: {
                            padding: '4px',
                            borderRadius: '4px',
                        },
                    },
                },
            },
            navigator: {
                group: 'Option',
                hidden: content => content.layoutType === 'free',
            },
        },
        tagElement: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-text', state: { name: 'Text' } },
            navigator: {
                group: 'Option',
                hidden: content => content.layoutType === 'free',
            },
        },
        flexboxElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-flexbox',
                state: {
                    name: 'Option container',
                    style: {
                        default: {
                            width: '100%',
                        },
                    },
                },
            },
            navigator: {
                group: 'Option',
                hidden: content => content.layoutType !== 'free',
            },
        },
        selectedFlexboxElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-flexbox',
                state: {
                    name: 'Option container',
                    style: {
                        default: {
                            width: '100%',
                        },
                    },
                },
            },
            navigator: {
                group: 'Option - Selected',
                hidden: content => content.layoutType !== 'free',
            },
        },
        removeTagIconElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-icon',
                state: {
                    name: 'Delete icon',
                    style: {
                        default: {
                            padding: '4px',
                            borderRadius: '4px',
                        },
                    },
                },
                content: { default: { icon: 'wwi wwi-cross', color: '#FFFFFF', fontSize: '16' } },
            },
            navigator: {
                group: 'Option - Selected',
            },
        },
        caretIconElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-icon',
                state: {
                    name: 'Caret icon',
                    style: {
                        default: {
                            padding: '12px',
                        },
                    },
                },
                content: { default: { icon: 'fas fa-caret-down', color: '#9CA3AF', fontSize: '16' } },
            },
            navigator: {
                group: 'Multiselect',
            },
        },
        clearIconElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-icon',
                state: {
                    name: 'Clear icon',
                    style: {
                        default: {
                            padding: '12px',
                        },
                    },
                },
                content: { default: { icon: 'wwi wwi-cross', color: '#9CA3AF', fontSize: '14' } },
            },
            navigator: {
                group: 'Multiselect',
            },
        },
        tagsDefaultBgColor: {
            label: {
                en: 'Default option background',
            },
            type: 'Color',
            defaultValue: '#099AF2',
        },
        tagsDefaultTextColor: {
            label: {
                en: 'Default option text color',
            },
            type: 'Color',
            defaultValue: '#FFFFFF',
        },
        optionBackgroundPointed: {
            label: {
                en: 'Dropdown option hover color',
            },
            type: 'Color',
            defaultValue: '#d1d5db',
        },
        dropdownBackgroundColor: {
            label: {
                en: 'Dropdown background color',
            },
            type: 'Color',
            defaultValue: '#ffffff',
        },
        dropdownBorderWidth: {
            type: 'Length',
            label: {
                en: 'Dropdown border width',
            },
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 1, max: 100 }],
            },
            defaultValue: '1px',
        },
        dropdownBorderColor: {
            label: {
                en: 'Dropdown background color',
            },
            type: 'Color',
            defaultValue: '#d1d5db',
        },
        dropdownBorderRadius: {
            type: 'Length',
            label: {
                en: 'Dropdown border radius',
            },
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 1, max: 100 }],
            },
            defaultValue: '4px',
        },
        dropdownMaxHeight: {
            label: {
                en: 'Dropdown max height',
            },
            type: 'Length',
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 1, max: 500 }],
            },
            responsive: true,
            states: true,
            defaultValue: '150px',
        },
    },
};
