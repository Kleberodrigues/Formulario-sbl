/**
 * Sistema de Traduções (i18n)
 * Suporta: Português (pt-BR), English (en), Български (bg), Română (ro)
 */

export const translations = {
  // Português (Brasil)
  'pt-BR': {
    // Step 1 - Welcome
    welcome: {
      headerTitle: 'Bem-vindo à',
      title: 'Silva Brothers Logistics LTD',
      description: 'Obrigado por demonstrar interesse na Silva Brothers Logistics LTD. Tornar-se um parceiro de entrega ficou mais fácil.',
      privacyText: 'Ao continuar, você concorda com nossa',
      privacyLink: 'política de privacidade',
      preferredLanguage: 'Idioma preferido',
      continueButton: 'Prosseguir',
      loadingButton: 'Carregando...'
    },

    // Step 2 - Depot
    depot: {
      title: 'Selecione seu Depósito',
      subtitle: 'Escolha o depósito mais próximo de você',
      dropdownLabel: 'Onde você gostaria de se candidatar?',
      dropdownPlaceholder: 'Selecione um depósito...',
      mainDepot: 'Principal',
      regionalDepot: 'Regional',
      selectDepot: 'Selecionar Depósito',
      selectButton: 'Selecionar',
      continueButton: 'Continuar',
      backButton: 'Voltar'
    },

    // Step 3 - Contact
    contact: {
      title: 'Dados de Contato',
      subtitle: 'Como podemos entrar em contato com você?',
      fullName: 'Nome Completo',
      fullNamePlaceholder: 'Digite seu nome completo',
      email: 'Email',
      emailPlaceholder: 'seu@email.com',
      phone: 'Telefone',
      phonePlaceholder: '+44 123 456 7890',
      continueButton: 'Continuar',
      backButton: 'Voltar'
    },

    // Step 4 - Chat
    chat: {
      title: 'Mensagem',
      subtitle: 'Envie uma mensagem',
      messagePlaceholder: 'Digite sua mensagem aqui...',
      sendButton: 'Enviar',
      continueButton: 'Continuar',
      backButton: 'Voltar'
    },

    // Step 5 - Personal Info
    personalInfo: {
      title: 'Informações Pessoais',
      subtitle: 'Precisamos saber um pouco mais sobre você',
      birthDate: 'Data de Nascimento',
      birthDatePlaceholder: 'DD/MM/AAAA',
      birthCity: 'Cidade de Nascimento',
      birthCityPlaceholder: 'Digite sua cidade de nascimento',
      motherName: 'Nome da Mãe',
      motherNamePlaceholder: 'Digite o nome da sua mãe',
      motherSurname: 'Sobrenome da Mãe',
      motherSurnamePlaceholder: 'Digite o sobrenome da sua mãe',
      nextOfKinName: 'Nome do Parente Próximo',
      nextOfKinNamePlaceholder: 'Nome completo',
      nextOfKinRelationship: 'Relação',
      nextOfKinRelationshipPlaceholder: 'Ex: Esposa, Filho, Irmão',
      nextOfKinPhone: 'Telefone do Parente',
      nextOfKinPhonePlaceholder: '+44 123 456 7890',
      continueButton: 'Continuar',
      backButton: 'Voltar'
    },

    // Step 6 - Address History
    addressHistory: {
      title: 'Histórico de Endereços',
      subtitle: 'Últimos 7 anos de residências',
      addAddress: 'Adicionar Endereço',
      editAddress: 'Editar Endereço',
      deleteAddress: 'Remover',
      addressLine1: 'Endereço (Linha 1)',
      addressLine2: 'Endereço (Linha 2)',
      city: 'Cidade',
      postcode: 'Postcode',
      fromDate: 'De (Data)',
      toDate: 'Até (Data)',
      current: 'Endereço Atual',
      noAddresses: 'Nenhum endereço adicionado',
      continueButton: 'Continuar',
      backButton: 'Voltar',
      saveButton: 'Salvar Endereço',
      cancelButton: 'Cancelar'
    },

    // Step 7 - Additional Info
    additionalInfo: {
      title: 'Informações Adicionais',
      subtitle: 'Documentação necessária',
      niNumber: 'National Insurance Number',
      niNumberPlaceholder: 'XX 999999 X',
      utrNumber: 'UTR Number',
      utrNumberPlaceholder: '1234567890',
      employmentStatus: 'Status de Emprego',
      employmentStatusPlaceholder: 'Ex: Empregado, Autônomo',
      vatNumber: 'VAT Number (opcional)',
      vatNumberPlaceholder: 'GB999999999',
      continueButton: 'Continuar',
      backButton: 'Voltar'
    },

    // Step 8 - Profile Photo
    profilePhoto: {
      title: 'Foto de Perfil',
      subtitle: 'Tire uma selfie para seu perfil',
      uploadButton: 'Carregar Foto',
      takePhoto: 'Tirar Foto',
      retakePhoto: 'Tirar Novamente',
      continueButton: 'Continuar',
      backButton: 'Voltar',
      dragDrop: 'Arraste e solte sua foto aqui',
      or: 'ou',
      selectFile: 'Selecione um arquivo',
      maxSize: 'Tamanho máximo: 5MB',
      formats: 'Formatos: JPG, PNG'
    },

    // Step 9 - Driving Licence
    drivingLicence: {
      title: 'Carteira de Motorista',
      subtitle: 'Faça upload da frente e verso da sua carteira',
      frontSide: 'Frente da Carteira',
      backSide: 'Verso da Carteira',
      uploadFront: 'Carregar Frente',
      uploadBack: 'Carregar Verso',
      continueButton: 'Continuar',
      backButton: 'Voltar',
      dragDrop: 'Arraste e solte aqui',
      or: 'ou',
      selectFile: 'Selecione um arquivo',
      maxSize: 'Tamanho máximo: 10MB',
      formats: 'Formatos: JPG, PNG, PDF'
    },

    // Step 10 - Bank Details
    bankDetails: {
      title: 'Dados Bancários',
      subtitle: 'Para pagamentos',
      accountNumber: 'Número da Conta',
      accountNumberPlaceholder: '12345678',
      sortCode: 'Sort Code',
      sortCodePlaceholder: '12-34-56',
      declarationTitle: 'Declaração de Pagamento',
      declarationText: 'Eu confirmo que os dados bancários fornecidos estão corretos e autorizo a Silva Brothers Logistics a fazer depósitos nesta conta.',
      acceptDeclaration: 'Eu aceito a declaração',
      continueButton: 'Continuar',
      backButton: 'Voltar'
    },

    // Step 11 - Document Guide
    documentGuide: {
      title: 'Guia de Documentos',
      subtitle: 'Informações importantes sobre seus dados',
      gdprTitle: 'Proteção de Dados (GDPR)',
      gdprText: 'Seus dados serão armazenados com segurança e usados apenas para fins de processamento de emprego.',
      dpaTitle: 'Data Protection Act',
      dpaText: 'Você tem direito de acessar, corrigir ou deletar seus dados a qualquer momento.',
      requiredDocs: 'Documentos Necessários',
      doc1: 'Right to Work in UK',
      doc2: 'Proof of Address',
      doc3: 'National Insurance Document',
      doc4: 'Bank Statement',
      doc5: 'VAT Certificate (se aplicável)',
      continueButton: 'Continuar para Upload',
      backButton: 'Voltar'
    },

    // Step 12 - Documents Upload
    documentsUpload: {
      title: 'Upload de Documentos',
      subtitle: 'Envie os documentos necessários',
      rightToWork: 'Right to Work in UK',
      proofOfAddress: 'Comprovante de Endereço',
      nationalInsurance: 'Documento NI',
      bankStatement: 'Extrato Bancário',
      vatCertificate: 'Certificado VAT (opcional)',
      uploadButton: 'Fazer Upload',
      uploaded: 'Enviado',
      pending: 'Pendente',
      dragDrop: 'Arraste e solte aqui',
      or: 'ou',
      selectFile: 'Selecione um arquivo',
      maxSize: 'Máximo: 10MB',
      formats: 'JPG, PNG, PDF',
      continueButton: 'Finalizar Cadastro',
      backButton: 'Voltar'
    },

    // Step Final - Completion
    completion: {
      title: 'Cadastro Completo!',
      greeting: 'Obrigado, {name}!',
      greetingGeneric: 'Obrigado por se cadastrar conosco!',
      emailLabel: 'Email',
      dateLabel: 'Data de Conclusão',
      depotLabel: 'Depósito Selecionado',
      notSpecified: 'Não especificado',
      nextStepsTitle: 'Próximos Passos',
      step1: 'Nossa equipe irá revisar seu cadastro',
      step2: 'Você receberá um email de confirmação em até 48 horas',
      step3: 'Aguarde contato para prosseguir com o processo',
      contactTitle: 'Precisa de Ajuda?',
      importantNotice: 'Mantenha seu email e telefone sempre atualizados para não perder nenhuma comunicação importante.',
      tagline: 'Conectando Talentos, Entregando Excelência',
      dashboardButton: 'Voltar ao Início',
      successMessage: 'Dados salvos com sucesso!'
    },

    // Validações
    validation: {
      required: 'Este campo é obrigatório',
      invalidEmail: 'Email inválido',
      invalidPhone: 'Telefone inválido (mínimo 10 dígitos)',
      nameTooShort: 'Nome muito curto (mínimo 3 caracteres)',
      nameTooLong: 'Nome muito longo (máximo 100 caracteres)',
      messageTooLong: 'Mensagem muito longa (máximo 500 caracteres)',
      invalidNiNumber: 'NI Number inválido (formato: XX 999999 X)',
      invalidUtr: 'UTR inválido (10 dígitos)',
      invalidVat: 'VAT inválido',
      invalidSortCode: 'Sort Code inválido (formato: XX-XX-XX)',
      invalidAccountNumber: 'Número de conta inválido (8 dígitos)',
      invalidPostcode: 'Postcode inválido',
      invalidDate: 'Data inválida',
      ageRequirement: 'Você deve ter pelo menos 18 anos',
      fileTooLarge: 'Arquivo muito grande (máximo: {size}MB)',
      invalidFileType: 'Tipo de arquivo não permitido',
      uploadFailed: 'Falha no upload. Tente novamente.'
    },

    // Mensagens do sistema
    system: {
      saving: 'Salvando...',
      saved: 'Salvo!',
      error: 'Erro ao salvar',
      networkError: 'Erro de conexão. Tente novamente.',
      tryAgain: 'Tentar Novamente',
      loading: 'Carregando...'
    },

    // Barra de progresso
    progress: {
      step: 'Etapa',
      of: 'de'
    }
  },

  // English
  'en': {
    welcome: {
      headerTitle: 'Welcome to',
      title: 'Silva Brothers Logistics LTD',
      description: 'Thank you for showing interest in Silva Brothers Logistics LTD. Becoming a delivery partner has been easier.',
      privacyText: 'By continuing, you agree with our',
      privacyLink: 'privacy policy',
      preferredLanguage: 'Preferred language',
      continueButton: 'Proceed',
      loadingButton: 'Loading...'
    },

    depot: {
      title: 'Select Your Depot',
      subtitle: 'Choose the depot closest to you',
      dropdownLabel: 'Where would you like to apply?',
      dropdownPlaceholder: 'Select a depot...',
      mainDepot: 'Main',
      regionalDepot: 'Regional',
      selectDepot: 'Select Depot',
      selectButton: 'Select',
      continueButton: 'Continue',
      backButton: 'Back'
    },

    contact: {
      title: 'Contact Information',
      subtitle: 'How can we reach you?',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      phone: 'Phone',
      phonePlaceholder: '+44 123 456 7890',
      continueButton: 'Continue',
      backButton: 'Back'
    },

    chat: {
      title: 'Message',
      subtitle: 'Send a message',
      messagePlaceholder: 'Type your message here...',
      sendButton: 'Send',
      continueButton: 'Continue',
      backButton: 'Back'
    },

    personalInfo: {
      title: 'Personal Information',
      subtitle: 'We need to know a bit more about you',
      birthDate: 'Date of Birth',
      birthDatePlaceholder: 'DD/MM/YYYY',
      birthCity: 'City of Birth',
      birthCityPlaceholder: 'Enter your city of birth',
      motherName: 'Mother\'s First Name',
      motherNamePlaceholder: 'Enter your mother\'s first name',
      motherSurname: 'Mother\'s Surname',
      motherSurnamePlaceholder: 'Enter your mother\'s surname',
      nextOfKinName: 'Next of Kin Name',
      nextOfKinNamePlaceholder: 'Full name',
      nextOfKinRelationship: 'Relationship',
      nextOfKinRelationshipPlaceholder: 'e.g. Wife, Son, Brother',
      nextOfKinPhone: 'Next of Kin Phone',
      nextOfKinPhonePlaceholder: '+44 123 456 7890',
      continueButton: 'Continue',
      backButton: 'Back'
    },

    addressHistory: {
      title: 'Address History',
      subtitle: 'Last 7 years of residences',
      addAddress: 'Add Address',
      editAddress: 'Edit Address',
      deleteAddress: 'Remove',
      addressLine1: 'Address Line 1',
      addressLine2: 'Address Line 2',
      city: 'City',
      postcode: 'Postcode',
      fromDate: 'From Date',
      toDate: 'To Date',
      current: 'Current Address',
      noAddresses: 'No addresses added',
      continueButton: 'Continue',
      backButton: 'Back',
      saveButton: 'Save Address',
      cancelButton: 'Cancel'
    },

    additionalInfo: {
      title: 'Additional Information',
      subtitle: 'Required documentation',
      niNumber: 'National Insurance Number',
      niNumberPlaceholder: 'XX 999999 X',
      utrNumber: 'UTR Number',
      utrNumberPlaceholder: '1234567890',
      employmentStatus: 'Employment Status',
      employmentStatusPlaceholder: 'e.g. Employed, Self-employed',
      vatNumber: 'VAT Number (optional)',
      vatNumberPlaceholder: 'GB999999999',
      continueButton: 'Continue',
      backButton: 'Back'
    },

    profilePhoto: {
      title: 'Profile Photo',
      subtitle: 'Take a selfie for your profile',
      uploadButton: 'Upload Photo',
      takePhoto: 'Take Photo',
      retakePhoto: 'Retake',
      continueButton: 'Continue',
      backButton: 'Back',
      dragDrop: 'Drag and drop your photo here',
      or: 'or',
      selectFile: 'Select a file',
      maxSize: 'Maximum size: 5MB',
      formats: 'Formats: JPG, PNG'
    },

    drivingLicence: {
      title: 'Driving Licence',
      subtitle: 'Upload front and back of your driving licence',
      frontSide: 'Front of Licence',
      backSide: 'Back of Licence',
      uploadFront: 'Upload Front',
      uploadBack: 'Upload Back',
      continueButton: 'Continue',
      backButton: 'Back',
      dragDrop: 'Drag and drop here',
      or: 'or',
      selectFile: 'Select a file',
      maxSize: 'Maximum size: 10MB',
      formats: 'Formats: JPG, PNG, PDF'
    },

    bankDetails: {
      title: 'Bank Details',
      subtitle: 'For payments',
      accountNumber: 'Account Number',
      accountNumberPlaceholder: '12345678',
      sortCode: 'Sort Code',
      sortCodePlaceholder: '12-34-56',
      declarationTitle: 'Payment Declaration',
      declarationText: 'I confirm that the bank details provided are correct and I authorize Silva Brothers Logistics to make deposits into this account.',
      acceptDeclaration: 'I accept the declaration',
      continueButton: 'Continue',
      backButton: 'Back'
    },

    documentGuide: {
      title: 'Document Guide',
      subtitle: 'Important information about your data',
      gdprTitle: 'Data Protection (GDPR)',
      gdprText: 'Your data will be stored securely and used only for employment processing purposes.',
      dpaTitle: 'Data Protection Act',
      dpaText: 'You have the right to access, correct, or delete your data at any time.',
      requiredDocs: 'Required Documents',
      doc1: 'Right to Work in UK',
      doc2: 'Proof of Address',
      doc3: 'National Insurance Document',
      doc4: 'Bank Statement',
      doc5: 'VAT Certificate (if applicable)',
      continueButton: 'Continue to Upload',
      backButton: 'Back'
    },

    documentsUpload: {
      title: 'Documents Upload',
      subtitle: 'Upload required documents',
      rightToWork: 'Right to Work in UK',
      proofOfAddress: 'Proof of Address',
      nationalInsurance: 'NI Document',
      bankStatement: 'Bank Statement',
      vatCertificate: 'VAT Certificate (optional)',
      uploadButton: 'Upload',
      uploaded: 'Uploaded',
      pending: 'Pending',
      dragDrop: 'Drag and drop here',
      or: 'or',
      selectFile: 'Select a file',
      maxSize: 'Maximum: 10MB',
      formats: 'JPG, PNG, PDF',
      continueButton: 'Complete Registration',
      backButton: 'Back'
    },

    completion: {
      title: 'Registration Complete!',
      greeting: 'Thank you, {name}!',
      greetingGeneric: 'Thank you for registering with us!',
      emailLabel: 'Email',
      dateLabel: 'Completion Date',
      depotLabel: 'Selected Depot',
      notSpecified: 'Not specified',
      nextStepsTitle: 'Next Steps',
      step1: 'Our team will review your registration',
      step2: 'You will receive a confirmation email within 48 hours',
      step3: 'Wait for contact to proceed with the process',
      contactTitle: 'Need Help?',
      importantNotice: 'Keep your email and phone always updated to not miss any important communication.',
      tagline: 'Connecting Talents, Delivering Excellence',
      dashboardButton: 'Back to Home',
      successMessage: 'Data saved successfully!'
    },

    validation: {
      required: 'This field is required',
      invalidEmail: 'Invalid email',
      invalidPhone: 'Invalid phone (minimum 10 digits)',
      nameTooShort: 'Name too short (minimum 3 characters)',
      nameTooLong: 'Name too long (maximum 100 characters)',
      messageTooLong: 'Message too long (maximum 500 characters)',
      invalidNiNumber: 'Invalid NI Number (format: XX 999999 X)',
      invalidUtr: 'Invalid UTR (10 digits)',
      invalidVat: 'Invalid VAT',
      invalidSortCode: 'Invalid Sort Code (format: XX-XX-XX)',
      invalidAccountNumber: 'Invalid account number (8 digits)',
      invalidPostcode: 'Invalid postcode',
      invalidDate: 'Invalid date',
      ageRequirement: 'You must be at least 18 years old',
      fileTooLarge: 'File too large (maximum: {size}MB)',
      invalidFileType: 'File type not allowed',
      uploadFailed: 'Upload failed. Please try again.'
    },

    system: {
      saving: 'Saving...',
      saved: 'Saved!',
      error: 'Error saving',
      networkError: 'Connection error. Please try again.',
      tryAgain: 'Try Again',
      loading: 'Loading...'
    },

    progress: {
      step: 'Step',
      of: 'of'
    }
  },

  // Български (Bulgarian)
  'bg': {
    welcome: {
      headerTitle: 'Добре дошли в',
      title: 'Silva Brothers Logistics LTD',
      description: 'Благодарим ви, че проявихте интерес към Silva Brothers Logistics LTD. Да станеш партньор за доставки стана по-лесно.',
      privacyText: 'Продължавайки, вие се съгласявате с нашата',
      privacyLink: 'политика за поверителност',
      preferredLanguage: 'Предпочитан език',
      continueButton: 'Продължи',
      loadingButton: 'Зареждане...'
    },

    depot: {
      title: 'Изберете вашия депо',
      subtitle: 'Изберете най-близкия до вас депо',
      dropdownLabel: 'Къде бихте искали да кандидатствате?',
      dropdownPlaceholder: 'Изберете депо...',
      mainDepot: 'Основен',
      regionalDepot: 'Регионален',
      selectDepot: 'Избери депо',
      selectButton: 'Избери',
      continueButton: 'Продължи',
      backButton: 'Назад'
    },

    contact: {
      title: 'Данни за контакт',
      subtitle: 'Как можем да се свържем с вас?',
      fullName: 'Пълно име',
      fullNamePlaceholder: 'Въведете вашето пълно име',
      email: 'Имейл',
      emailPlaceholder: 'вашият@имейл.com',
      phone: 'Телефон',
      phonePlaceholder: '+359 123 456 789',
      continueButton: 'Продължи',
      backButton: 'Назад'
    },

    chat: {
      title: 'Съобщение',
      subtitle: 'Изпратете съобщение',
      messagePlaceholder: 'Напишете вашето съобщение тук...',
      sendButton: 'Изпрати',
      continueButton: 'Продължи',
      backButton: 'Назад'
    },

    personalInfo: {
      title: 'Лична информация',
      subtitle: 'Трябва да знаем малко повече за вас',
      birthDate: 'Дата на раждане',
      birthDatePlaceholder: 'ДД/ММ/ГГГГ',
      birthCity: 'Град на раждане',
      birthCityPlaceholder: 'Въведете вашия град на раждане',
      motherName: 'Име на майката',
      motherNamePlaceholder: 'Въведете името на майка си',
      motherSurname: 'Фамилия на майката',
      motherSurnamePlaceholder: 'Въведете фамилията на майка си',
      nextOfKinName: 'Име на близък роднина',
      nextOfKinNamePlaceholder: 'Пълно име',
      nextOfKinRelationship: 'Родство',
      nextOfKinRelationshipPlaceholder: 'Напр.: Съпруга, Син, Брат',
      nextOfKinPhone: 'Телефон на роднина',
      nextOfKinPhonePlaceholder: '+44 123 456 7890',
      continueButton: 'Продължи',
      backButton: 'Назад'
    },

    addressHistory: {
      title: 'История на адресите',
      subtitle: 'Последните 7 години на пребиваване',
      addAddress: 'Добави адрес',
      editAddress: 'Редактирай адрес',
      deleteAddress: 'Премахни',
      addressLine1: 'Адрес (Ред 1)',
      addressLine2: 'Адрес (Ред 2)',
      city: 'Град',
      postcode: 'Пощенски код',
      fromDate: 'От дата',
      toDate: 'До дата',
      current: 'Текущ адрес',
      noAddresses: 'Няма добавени адреси',
      continueButton: 'Продължи',
      backButton: 'Назад',
      saveButton: 'Запази адрес',
      cancelButton: 'Отказ'
    },

    additionalInfo: {
      title: 'Допълнителна информация',
      subtitle: 'Необходима документация',
      niNumber: 'Номер на национална застраховка',
      niNumberPlaceholder: 'XX 999999 X',
      utrNumber: 'UTR номер',
      utrNumberPlaceholder: '1234567890',
      employmentStatus: 'Статус на заетост',
      employmentStatusPlaceholder: 'Напр.: Нает, Самонает',
      vatNumber: 'ДДС номер (незадължително)',
      vatNumberPlaceholder: 'GB999999999',
      continueButton: 'Продължи',
      backButton: 'Назад'
    },

    profilePhoto: {
      title: 'Снимка на профила',
      subtitle: 'Направете селфи за вашия профил',
      uploadButton: 'Качи снимка',
      takePhoto: 'Направи снимка',
      retakePhoto: 'Направи отново',
      continueButton: 'Продължи',
      backButton: 'Назад',
      dragDrop: 'Плъзнете и пуснете снимката тук',
      or: 'или',
      selectFile: 'Изберете файл',
      maxSize: 'Максимален размер: 5MB',
      formats: 'Формати: JPG, PNG'
    },

    drivingLicence: {
      title: 'Шофьорска книжка',
      subtitle: 'Качете предна и задна част на шофьорската си книжка',
      frontSide: 'Предна част',
      backSide: 'Задна част',
      uploadFront: 'Качи предна част',
      uploadBack: 'Качи задна част',
      continueButton: 'Продължи',
      backButton: 'Назад',
      dragDrop: 'Плъзнете и пуснете тук',
      or: 'или',
      selectFile: 'Изберете файл',
      maxSize: 'Максимален размер: 10MB',
      formats: 'Формати: JPG, PNG, PDF'
    },

    bankDetails: {
      title: 'Банкови данни',
      subtitle: 'За плащания',
      accountNumber: 'Номер на сметка',
      accountNumberPlaceholder: '12345678',
      sortCode: 'Sort Code',
      sortCodePlaceholder: '12-34-56',
      declarationTitle: 'Декларация за плащане',
      declarationText: 'Потвърждавам, че предоставените банкови данни са верни и разрешавам на Silva Brothers Logistics да прави депозити в тази сметка.',
      acceptDeclaration: 'Приемам декларацията',
      continueButton: 'Продължи',
      backButton: 'Назад'
    },

    documentGuide: {
      title: 'Ръководство за документи',
      subtitle: 'Важна информация за вашите данни',
      gdprTitle: 'Защита на данните (GDPR)',
      gdprText: 'Вашите данни ще бъдат съхранявани сигурно и използвани само за целите на обработка на заетостта.',
      dpaTitle: 'Закон за защита на данните',
      dpaText: 'Имате право да получите достъп, коригирате или изтриете вашите данни по всяко време.',
      requiredDocs: 'Необходими документи',
      doc1: 'Право на работа в Обединеното кралство',
      doc2: 'Доказателство за адрес',
      doc3: 'Документ за национална застраховка',
      doc4: 'Банково извлечение',
      doc5: 'ДДС сертификат (ако е приложимо)',
      continueButton: 'Продължи към качване',
      backButton: 'Назад'
    },

    documentsUpload: {
      title: 'Качване на документи',
      subtitle: 'Качете необходимите документи',
      rightToWork: 'Право на работа в UK',
      proofOfAddress: 'Доказателство за адрес',
      nationalInsurance: 'NI документ',
      bankStatement: 'Банково извлечение',
      vatCertificate: 'ДДС сертификат (незадължително)',
      uploadButton: 'Качи',
      uploaded: 'Качено',
      pending: 'В изчакване',
      dragDrop: 'Плъзнете и пуснете тук',
      or: 'или',
      selectFile: 'Изберете файл',
      maxSize: 'Максимум: 10MB',
      formats: 'JPG, PNG, PDF',
      continueButton: 'Завърши регистрацията',
      backButton: 'Назад'
    },

    completion: {
      title: 'Регистрацията е завършена!',
      greeting: 'Благодарим ви, {name}!',
      greetingGeneric: 'Благодарим ви за регистрацията!',
      emailLabel: 'Имейл',
      dateLabel: 'Дата на завършване',
      depotLabel: 'Избран депо',
      notSpecified: 'Не е посочено',
      nextStepsTitle: 'Следващи стъпки',
      step1: 'Нашият екип ще прегледа вашата регистрация',
      step2: 'Ще получите потвърждаващ имейл в рамките на 48 часа',
      step3: 'Изчакайте контакт, за да продължите с процеса',
      contactTitle: 'Нуждаете се от помощ?',
      importantNotice: 'Поддържайте имейла и телефона си винаги актуални, за да не пропуснете важни съобщения.',
      tagline: 'Свързване на таланти, доставка на съвършенство',
      dashboardButton: 'Обратно към началото',
      successMessage: 'Данните са запазени успешно!'
    },

    validation: {
      required: 'Това поле е задължително',
      invalidEmail: 'Невалиден имейл',
      invalidPhone: 'Невалиден телефон (минимум 10 цифри)',
      nameTooShort: 'Името е твърде кратко (минимум 3 знака)',
      nameTooLong: 'Името е твърде дълго (максимум 100 знака)',
      messageTooLong: 'Съобщението е твърде дълго (максимум 500 знака)',
      invalidNiNumber: 'Невалиден NI номер (формат: XX 999999 X)',
      invalidUtr: 'Невалиден UTR (10 цифри)',
      invalidVat: 'Невалиден ДДС',
      invalidSortCode: 'Невалиден Sort Code (формат: XX-XX-XX)',
      invalidAccountNumber: 'Невалиден номер на сметка (8 цифри)',
      invalidPostcode: 'Невалиден пощенски код',
      invalidDate: 'Невалидна дата',
      ageRequirement: 'Трябва да сте навършили поне 18 години',
      fileTooLarge: 'Файлът е твърде голям (максимум: {size}MB)',
      invalidFileType: 'Неразрешен тип файл',
      uploadFailed: 'Неуспешно качване. Моля, опитайте отново.'
    },

    system: {
      saving: 'Записване...',
      saved: 'Записано!',
      error: 'Грешка при записване',
      networkError: 'Грешка във връзката. Моля, опитайте отново.',
      tryAgain: 'Опитайте отново',
      loading: 'Зареждане...'
    },

    progress: {
      step: 'Стъпка',
      of: 'от'
    }
  },

  // Română (Romanian)
  'ro': {
    welcome: {
      headerTitle: 'Bine ați venit la',
      title: 'Silva Brothers Logistics LTD',
      description: 'Vă mulțumim pentru interesul manifestat față de Silva Brothers Logistics LTD. Devine partener de livrare a devenit mai ușor.',
      privacyText: 'Continuând, sunteți de acord cu',
      privacyLink: 'politica noastră de confidențialitate',
      preferredLanguage: 'Limba preferată',
      continueButton: 'Continuă',
      loadingButton: 'Se încarcă...'
    },

    depot: {
      title: 'Selectați depozitul dvs.',
      subtitle: 'Alegeți depozitul cel mai apropiat de dvs.',
      dropdownLabel: 'Unde ați dori să aplicați?',
      dropdownPlaceholder: 'Selectați un depozit...',
      mainDepot: 'Principal',
      regionalDepot: 'Regional',
      selectDepot: 'Selectează depozitul',
      selectButton: 'Selectează',
      continueButton: 'Continuă',
      backButton: 'Înapoi'
    },

    contact: {
      title: 'Date de contact',
      subtitle: 'Cum vă putem contacta?',
      fullName: 'Nume complet',
      fullNamePlaceholder: 'Introduceți numele complet',
      email: 'Email',
      emailPlaceholder: 'email@dvs.com',
      phone: 'Telefon',
      phonePlaceholder: '+40 123 456 789',
      continueButton: 'Continuă',
      backButton: 'Înapoi'
    },

    chat: {
      title: 'Mesaj',
      subtitle: 'Trimiteți un mesaj',
      messagePlaceholder: 'Scrieți mesajul dvs. aici...',
      sendButton: 'Trimite',
      continueButton: 'Continuă',
      backButton: 'Înapoi'
    },

    personalInfo: {
      title: 'Informații personale',
      subtitle: 'Trebuie să știm puțin mai multe despre dvs.',
      birthDate: 'Data nașterii',
      birthDatePlaceholder: 'ZZ/LL/AAAA',
      birthCity: 'Orașul nașterii',
      birthCityPlaceholder: 'Introduceți orașul nașterii',
      motherName: 'Prenumele mamei',
      motherNamePlaceholder: 'Introduceți prenumele mamei',
      motherSurname: 'Numele de familie al mamei',
      motherSurnamePlaceholder: 'Introduceți numele de familie al mamei',
      nextOfKinName: 'Numele unei rude apropiate',
      nextOfKinNamePlaceholder: 'Nume complet',
      nextOfKinRelationship: 'Relația',
      nextOfKinRelationshipPlaceholder: 'Ex: Soție, Fiu, Frate',
      nextOfKinPhone: 'Telefonul rudei',
      nextOfKinPhonePlaceholder: '+44 123 456 7890',
      continueButton: 'Continuă',
      backButton: 'Înapoi'
    },

    addressHistory: {
      title: 'Istoricul adreselor',
      subtitle: 'Ultimii 7 ani de reședințe',
      addAddress: 'Adaugă adresă',
      editAddress: 'Editează adresa',
      deleteAddress: 'Șterge',
      addressLine1: 'Adresa (Linia 1)',
      addressLine2: 'Adresa (Linia 2)',
      city: 'Oraș',
      postcode: 'Cod poștal',
      fromDate: 'De la data',
      toDate: 'Până la data',
      current: 'Adresa curentă',
      noAddresses: 'Nu au fost adăugate adrese',
      continueButton: 'Continuă',
      backButton: 'Înapoi',
      saveButton: 'Salvează adresa',
      cancelButton: 'Anulează'
    },

    additionalInfo: {
      title: 'Informații suplimentare',
      subtitle: 'Documentație necesară',
      niNumber: 'Numărul de asigurare națională',
      niNumberPlaceholder: 'XX 999999 X',
      utrNumber: 'Numărul UTR',
      utrNumberPlaceholder: '1234567890',
      employmentStatus: 'Statutul de angajare',
      employmentStatusPlaceholder: 'Ex: Angajat, Freelancer',
      vatNumber: 'Numărul TVA (opțional)',
      vatNumberPlaceholder: 'GB999999999',
      continueButton: 'Continuă',
      backButton: 'Înapoi'
    },

    profilePhoto: {
      title: 'Fotografia de profil',
      subtitle: 'Faceți un selfie pentru profilul dvs.',
      uploadButton: 'Încarcă fotografia',
      takePhoto: 'Faceți o fotografie',
      retakePhoto: 'Refaceți',
      continueButton: 'Continuă',
      backButton: 'Înapoi',
      dragDrop: 'Glisați și plasați fotografia aici',
      or: 'sau',
      selectFile: 'Selectați un fișier',
      maxSize: 'Dimensiune maximă: 5MB',
      formats: 'Formate: JPG, PNG'
    },

    drivingLicence: {
      title: 'Permis de conducere',
      subtitle: 'Încărcați fața și dosul permisului',
      frontSide: 'Fața permisului',
      backSide: 'Dosul permisului',
      uploadFront: 'Încarcă fața',
      uploadBack: 'Încarcă dosul',
      continueButton: 'Continuă',
      backButton: 'Înapoi',
      dragDrop: 'Glisați și plasați aici',
      or: 'sau',
      selectFile: 'Selectați un fișier',
      maxSize: 'Dimensiune maximă: 10MB',
      formats: 'Formate: JPG, PNG, PDF'
    },

    bankDetails: {
      title: 'Detalii bancare',
      subtitle: 'Pentru plăți',
      accountNumber: 'Numărul contului',
      accountNumberPlaceholder: '12345678',
      sortCode: 'Sort Code',
      sortCodePlaceholder: '12-34-56',
      declarationTitle: 'Declarația de plată',
      declarationText: 'Confirm că detaliile bancare furnizate sunt corecte și autorizez Silva Brothers Logistics să efectueze depuneri în acest cont.',
      acceptDeclaration: 'Accept declarația',
      continueButton: 'Continuă',
      backButton: 'Înapoi'
    },

    documentGuide: {
      title: 'Ghid documente',
      subtitle: 'Informații importante despre datele dvs.',
      gdprTitle: 'Protecția datelor (GDPR)',
      gdprText: 'Datele dvs. vor fi stocate în siguranță și utilizate numai în scopul procesării angajării.',
      dpaTitle: 'Legea protecției datelor',
      dpaText: 'Aveți dreptul de a accesa, corecta sau șterge datele dvs. în orice moment.',
      requiredDocs: 'Documente necesare',
      doc1: 'Dreptul de muncă în Marea Britanie',
      doc2: 'Dovada adresei',
      doc3: 'Document de asigurare națională',
      doc4: 'Extras bancar',
      doc5: 'Certificat TVA (dacă este cazul)',
      continueButton: 'Continuați la încărcare',
      backButton: 'Înapoi'
    },

    documentsUpload: {
      title: 'Încărcarea documentelor',
      subtitle: 'Încărcați documentele necesare',
      rightToWork: 'Dreptul de muncă în UK',
      proofOfAddress: 'Dovada adresei',
      nationalInsurance: 'Document NI',
      bankStatement: 'Extras bancar',
      vatCertificate: 'Certificat TVA (opțional)',
      uploadButton: 'Încarcă',
      uploaded: 'Încărcat',
      pending: 'În așteptare',
      dragDrop: 'Glisați și plasați aici',
      or: 'sau',
      selectFile: 'Selectați un fișier',
      maxSize: 'Maxim: 10MB',
      formats: 'JPG, PNG, PDF',
      continueButton: 'Finalizați înregistrarea',
      backButton: 'Înapoi'
    },

    completion: {
      title: 'Înregistrare completă!',
      greeting: 'Vă mulțumim, {name}!',
      greetingGeneric: 'Vă mulțumim pentru înregistrare!',
      emailLabel: 'Email',
      dateLabel: 'Data finalizării',
      depotLabel: 'Depozit selectat',
      notSpecified: 'Nespecificat',
      nextStepsTitle: 'Pașii următori',
      step1: 'Echipa noastră va revizui înregistrarea dvs.',
      step2: 'Veți primi un email de confirmare în 48 de ore',
      step3: 'Așteptați contactul pentru a continua procesul',
      contactTitle: 'Aveți nevoie de ajutor?',
      importantNotice: 'Mențineți emailul și telefonul mereu actualizate pentru a nu pierde comunicări importante.',
      tagline: 'Conectând talente, livrând excelență',
      dashboardButton: 'Înapoi la început',
      successMessage: 'Datele au fost salvate cu succes!'
    },

    validation: {
      required: 'Acest câmp este obligatoriu',
      invalidEmail: 'Email invalid',
      invalidPhone: 'Telefon invalid (minim 10 cifre)',
      nameTooShort: 'Nume prea scurt (minim 3 caractere)',
      nameTooLong: 'Nume prea lung (maxim 100 caractere)',
      messageTooLong: 'Mesaj prea lung (maxim 500 caractere)',
      invalidNiNumber: 'Număr NI invalid (format: XX 999999 X)',
      invalidUtr: 'UTR invalid (10 cifre)',
      invalidVat: 'TVA invalid',
      invalidSortCode: 'Sort Code invalid (format: XX-XX-XX)',
      invalidAccountNumber: 'Număr cont invalid (8 cifre)',
      invalidPostcode: 'Cod poștal invalid',
      invalidDate: 'Dată invalidă',
      ageRequirement: 'Trebuie să aveți cel puțin 18 ani',
      fileTooLarge: 'Fișier prea mare (maxim: {size}MB)',
      invalidFileType: 'Tip de fișier nepermis',
      uploadFailed: 'Încărcare eșuată. Încercați din nou.'
    },

    system: {
      saving: 'Se salvează...',
      saved: 'Salvat!',
      error: 'Eroare la salvare',
      networkError: 'Eroare de conexiune. Încercați din nou.',
      tryAgain: 'Încercați din nou',
      loading: 'Se încarcă...'
    },

    progress: {
      step: 'Pasul',
      of: 'din'
    }
  }
}

/**
 * Obter tradução para um idioma e chave
 * @param {string} lang - Código do idioma (pt-BR, en, bg, ro)
 * @param {string} key - Chave da tradução (ex: 'welcome.title')
 * @returns {string} - Texto traduzido
 */
export function t(lang, key) {
  const keys = key.split('.')
  let value = translations[lang]

  for (const k of keys) {
    if (!value) return key
    value = value[k]
  }

  return value || key
}

/**
 * Obter idioma do navegador
 * @returns {string} - Código do idioma
 */
export function getBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage

  // Mapear variações de idioma
  if (browserLang.startsWith('pt')) return 'pt-BR'
  if (browserLang.startsWith('en')) return 'en'
  if (browserLang.startsWith('bg')) return 'bg'
  if (browserLang.startsWith('ro')) return 'ro'

  return 'pt-BR' // Default
}

/**
 * Obter idioma salvo no localStorage ou idioma do navegador
 * @returns {string} - Código do idioma
 */
export function getSavedLanguage() {
  const saved = localStorage.getItem('sbl_language')
  return saved || getBrowserLanguage()
}

/**
 * Salvar idioma selecionado no localStorage
 * @param {string} lang - Código do idioma
 */
export function saveLanguage(lang) {
  localStorage.setItem('sbl_language', lang)
}

export default {
  translations,
  t,
  getBrowserLanguage,
  getSavedLanguage,
  saveLanguage
}
