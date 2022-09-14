export default {
    editor: {
        label: {
            en: 'Input multiselect (legacy)',
            fr: 'Champs sélection multiple (legacy)',
        },
        icon: 'fontawesome/solid/chevron-circle-down',
        bubble: {
            color: 'ww-color-yellow-500',
            icon: 'warning',
        },
    },
    options: {
        noBorderRadiusClipping: true,
    },
    triggerEvents: [{ name: 'change', label: { en: 'On change' }, event: { value: [] } }],
    properties: {
        fontSize: {
            label: {
                en: 'Size',
                fr: 'Taille',
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
            defaultValue: '16px',
        },
        maxDropdownHeight: {
            label: {
                en: 'Max dropdown height',
                fr: 'Hauteur maximum du menu',
            },
            type: 'Length',
            options: {
                unitChoices: [{ value: 'px', label: 'px', min: 1, max: 500 }],
            },
            responsive: true,
            states: true,
            defaultValue: '150px',
        },
        tagsDefaultBgColor: {
            label: {
                en: 'Default bg color (tags)',
                fr: 'Couleur de fond des tags',
            },
            type: 'Color',
            defaultValue: '#099AF2',
        },
        tagsDefaultTextColor: {
            label: {
                en: 'Default text color (tags)',
                fr: 'Couleur du texte des tags',
            },
            type: 'Color',
            defaultValue: '#FFFFFF',
        },
        placeholder: {
            label: {
                en: 'Placeholder',
                fr: 'Texte par défaut',
            },
            type: 'Text',
            defaultValue: '',
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
        bgColorField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
            label: {
                en: 'Bg color field',
                fr: 'Bg color field',
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
        textColorField: {
            hidden: (content, sidepanelContent, boundProps) => !boundProps.options || !content.options,
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
    },
};
