export default {
    editor: {
        label: {
            en: 'Input multiselect',
            fr: 'Champs sélection multiple',
        },
        icon: 'fontawesome/solid/chevron-circle-down',
        customSettingsPropertiesOrder: [
            'isOpen',
            ['placeholder'],
            ['disabled', 'mode', 'allowCreation', 'hideSelected', 'searchable', 'closeOnSelect'],
            ['initialValue', 'options'],
            ['hintFields', 'labelField', 'valueField'],
        ],
    },
    options: {
        noBorderRadiusClipping: true,
    },
    triggerEvents: [{ name: 'change', label: { en: 'On change' }, event: { value: [] } }],
    properties: {
        isOpen: {
            type: 'OnOff',
            label: {
                en: 'Is open?',
                fr: 'Is open?',
            },
            defaultValue: false,
            section: 'settings',
        },
        placeholder: {
            label: {
                en: 'Placeholder',
                fr: 'Texte par défaut',
            },
            type: 'Text',
            defaultValue: 'placeholder',
            section: 'settings',
            bindable: true,
            multiLang: true,
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
        },
        allowCreation: {
            label: {
                en: 'Allow to create option',
                fr: "Permettre la création d'option",
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
            bindable: true,
        },
        hideSelected: {
            label: {
                en: 'Hide selected elements',
                fr: 'Cacher les éléments sélectionnés',
            },
            type: 'OnOff',
            defaultValue: true,
            section: 'settings',
        },
        searchable: {
            label: {
                en: 'Searchable',
                fr: 'Recherche',
            },
            type: 'OnOff',
            defaultValue: true,
            section: 'settings',
        },
        closeOnSelect: {
            label: {
                en: 'Close on select',
                fr: 'Ferme à la sélection',
            },
            type: 'OnOff',
            defaultValue: false,
            section: 'settings',
        },
        initialValue: {
            label: {
                en: 'Initial value',
                fr: 'Valeur initiale',
            },
            type: 'Array',
            bindable: true,
            section: 'settings',
        },
        options: {
            label: { en: 'Options', fr: 'Options' },
            type: 'Array',
            section: 'settings',
            options: {
                item: {
                    type: 'Object',
                    defaultValue: { label: '', value: '', bgColor: null, textColor: null },
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
                            bgColor: {
                                label: { en: 'Background color' },
                                type: 'Color',
                            },
                            textColor: {
                                label: { en: 'Text color' },
                                type: 'Color',
                            },
                        },
                    },
                },
            },
            defaultValue: [
                { value: 'option', label: { en: 'option - 1' }, bgColor: null, textColor: null },
                { value: 'option2', label: { en: 'option - 2' }, bgColor: null, textColor: null },
            ],
            bindable: true,
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
        tagElementSelected: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-text',
                state: {
                    name: 'Option text - selected',
                    style: {
                        default: {
                            padding: '4px',
                            borderRadius: '4px',
                        },
                    },
                },
            },
        },
        tagElement: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-text', state: { name: 'Option text' } },
        },
        iconElement: {
            hidden: true,
            defaultValue: {
                isWwObject: true,
                type: 'ww-icon',
                state: {
                    name: 'Option delete icon',
                    style: {
                        default: {
                            padding: '4px',
                            borderRadius: '4px',
                        },
                    },
                },
                content: { default: { icon: 'wwi wwi-cross', color: '#FFFFFF', fontSize: '16' } },
            },
        },
        placeholderElement: {
            hidden: true,
            defaultValue: { isWwObject: true, type: 'ww-text', state: { name: 'Placeholder text' } },
        },
    },
};
