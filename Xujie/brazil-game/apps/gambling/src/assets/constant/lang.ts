export const t = {
  Error: 'Erro',
  Loading: 'Cargando',
  Reload: 'Recarregar',
  dot: '.',
  Page: 'Page',
  Back: 'Voltar',
  Next: 'Próxima',
  back: 'voltar',
  next: 'próxima',
  goBack: 'Retornar',
  Pending: 'Pendente',
  Completed: 'Concluido',
  Failed: 'Fracassada',
  Frozen: 'Congelada',
  Times: 'Vezes', // 次數
  noData: 'Nada aqui',
  phoneNumberHint: 'Tu número de celular',
  phoneNumberError: 'Número de celular de 10 ou 11 dígitos',
  confirmPhone: 'Confirme o número do celular',
  pwdHint: 'Senha (4-16 letras e números)',
  pwdError: 'Senha (4-16 caracteres, incluindo letras, números ou símbolos)',
  forgetPwd: 'Esqueça A Senha',
  forgetPwdLowerCase: 'esqueça a senha',
  resetPwd: 'Redefinir senha',
  login: 'Entrar',
  verifyCode: 'Código de verificação',
  verifyGraph: 'Código gráfico',
  registerNow: 'Register agora',
  agree: 'Eu concordo',
  policyANDPrivacy: 'Condições e condições, política de privacidade',
  registerConfirmPhone:
    'Por favor, verifique novamente as informações que você inseriu. O número de celular deve ter 10 ou 11 dígitos.',
  registerConfirmPhoneAgain:
    'Por favor, verifique novamente as informações que você inseriu. Os números de telefone estão inconsistentes.',
  registerConfirmPwd:
    'Por favor, verifique novamente as informações que você inseriu. A senha deve conter de (4-16 letras e números).',
  registerConfirmVerify:
    'Por favor, verifique novamente as informações que você inseriu. Campo do código de verificação.',
  phoneNumberDifferent: 'Os números de telefone estão inconsistentes.',
  enterVerify: 'por favor insira o código de verificação',

  totalRechargeAmount: 'Depósitos totais',
  totalBetAmount: 'Número total de apostas',
  level0Desc: (platformName: string) =>
    `Bem-vindo ao ${platformName}! Como novo jogador, você está atualmente no Nível 0. Quer experimentar mais emoção e conteúdo exclusivo do jogo? Recarregue agora e suba de nível! Desbloqueie jogos de níveis superiores e recompensas exclusivas esperando por você. Clique em "Primeira recarga" para começar sua jornada para o próximo nível!`,
  signInBonusTitle: (signInTotalDays: number) =>
    `Recompensa total de check-in de ${signInTotalDays} dias`,
  upRewardAmountTitle: 'Recompensa de atualização',
  withdrawAmountLimitDayStringTitle: 'Limite máximo de retirada única',
  withdrawTimesLimitDayTitle: 'Número de retiradas por dia',
  Level: 'Nivel',
  Bonus: 'Bônus',

  howToInvite: 'Como convidar',
  dailyData: 'Dados diários',

  totalBill: 'Total Da Conta',
  depositAccount: 'Depositar conta',
  promotedAccount: 'Conta Promovida',
  totalCountDescription:
    '“Total Da Conta” é o registro financeiro de “Depositar conta” e “Conta promovida” somados',
  depositDescription:
    'Uma conta que consiste no valor da recarga, recompensas pela participação em atividades, vitórias e derrotas no jogo, etc.',
  promotionDescription:
    'Uma conta composta por recompensas por convidar amigos e retorno de comissões com base no valor da transação dos usuários convidados.',
  Total: 'Total',
  Balance: 'Balanço',
  Withdraw: 'Retirar',
  Withdrawable: 'Retirável',
  Deposit: 'Depósito',
  walletDeopsitNotificationP1: (
    recharge_bonus_start: number | undefined,
    recharge_first_cashback_rate: string | undefined
  ) =>
    `Prezado usuário, quando a primeira recarga ultrapassar R$ ${recharge_bonus_start}, você receberá um bônus adicional de recarga de ${recharge_first_cashback_rate}.`,
  walletDeopsitNotificationP2: (
    recharge_bonus_start: number | undefined,
    recharge_cashback_rate: string | undefined,
    buyTimes: number
  ) =>
    ` A partir da segunda recarga, caso o valor da recarga ultrapasse R$ ${recharge_bonus_start}, você receberá um bônus de recarga adicional de até ${recharge_cashback_rate}! ${
      buyTimes === 0 ? 'Q' : `${buyTimes} vezes ao dia, q`
    }uanto maior o valor da recarga, maior será a recompensa!`,
  walletDeopsitNotificationP1_u7: (
    recharge_bonus_start: number | undefined,
    recharge_first_cashback_rate: string | undefined
  ) =>
    `Prezado usuário, quando o valor da primeira recarga ultrapassar R$ ${recharge_bonus_start} reais, você receberá até ${recharge_first_cashback_rate} de recompensa de recarga.`,
  walletDeopsitNotificationP2_u7: (
    recharge_bonus_start: number | undefined,
    recharge_cashback_rate: string | undefined,
    buyTimes: number
  ) =>
    ` A partir da segunda recarga, se o valor da recarga ultrapassar R$ ${recharge_bonus_start}, você receberá um bônus de recarga de até ${recharge_cashback_rate}! ${
      buyTimes === 0 ? 'Q' : `${buyTimes} vezes ao dia, q`
    }uanto maior o valor da recarga, maior a proporção de presentes!`,
  moneyWithRSign: (money: number | string) => `R$ ${money}`,
  walletDeopsitInputPlaceholder: 'Por favor, insira o valor',
  // wallet-deposit-next <WalletDepositNextPage>
  payIn15Mins: 'Ordem de pagamento criada com sucesso, pague em 15 minutos!',
  createDate: 'Data de criaqao',
  Time: 'Tempo',
  requestedNumber: 'Numero solicitado',
  payOrder: 'Pague a corda',
  copyCode: 'Copiar Código',
  copyCode_u7: 'Copiar Código De Pix',
  hadPaid: 'Já pago',
  Copied: 'Copiado!',
  Details: 'Details',
  Detalhes: 'Detalhes',
  // Wallet page panel=withdraw
  withdrawRestrictTitle: 'A conta está sendo liquidada',
  withdrawRestrictP1: (withdrawBegin: string, withdrawEnd: string) =>
    `Prezado cliente: Olá! Em resposta às exigências do Banco Central do Brasil e do recém-criado comitê de agências reguladoras relevantes no Brasil, a plataforma precisa concluir a troca de dados entre o Banco Central e as agências reguladoras relevantes das ${withdrawBegin} às ${withdrawEnd}, horário brasileiro!`,
  withdrawRestrictP2:
    'As recompensas da promoção podem ser retiradas Todos os nossos esforços são para garantir que a operação da plataforma esteja mais em conformidade com as leis e regulamentos brasileiros relevantes! Proteger a privacidade dos utilizadores e os direitos e interesses conexos. Obrigado pela sua compreensão..',
  withdrawRestrictP3:
    'As retiradas serão normais durante outros períodos de tempo na plataforma.',
  withdrawWarning:
    'Por favor, preencha o número do CPF corretamente. Se a informação estiver incorreta, o saque falhará. Certifique - se de verificar as informações com atenção.',
  withdrawRestrictP1_U7: `Prezado cliente: Olá! Em resposta às exigências do Banco Central do Brasil e do recém-criado comitê de agências reguladoras relevantes no Brasil, a plataforma precisa concluir a troca de dados entre o Banco Central e as agências reguladoras relevantes das `,
  minimalWithdrawAmount: 'Retirada mínima',
  accountHolderName: 'Nome do titular da conta',
  accountHolderNameHint: 'Insira o nome do titular do cartão',
  CPFCode: 'Código CPF',
  CPFCodeHint: 'Insira o seu código CPF',
  typeOfPix: 'Tipo Pix',
  telephone55: 'Telefone(+55)',
  tel55: '+55',
  withdrawTermsTitle: 'Regras de Retirada',
  withdrawTermsP1Span1:
    'O valor e a frequência do saque diário estão diretamente relacionados ao seu nível VIP.Nível atual',
  VIPLevel: (vip_level: number) => `VIP ${vip_level}`,
  withdrawTermsP1Span2: ', o valor mínimo de saque diário é de ',
  withdrawTermsP1Span3: ' e o valor máximo de saque é de ',
  withdrawTermsP2Span1: 'O valor da retirada deve ser em múltiplos de 10.',
  withdrawTermsP2Span2: 'Por exemplo: 10, 20, 110, 920, 2.8620…',
  withdrawTermsP3:
    'As recompensas da promoção podem ser retiradas diretamente.',
  withdrawTermsP4:
    'O saldo não retirável na conta de recarga (Atividade) (incluindo, entre outros, o valor da recarga, recompensas por participar de atividades e valor de ganhos e perdas do jogo, etc.), pode ser retirado aumentando o valor da transação do jogo e obtendo um valor de lucro maior.',
  withdrawTermsP5:
    'Por favor, preencha o número do CPF corretamente. Se a informação estiver incorreta, o saque falhará. Certifique-se de verificar as informações com atenção.',
  withdrawTermsP6: (withdrawBegin: string, withdrawEnd: string) =>
    `Prezado cliente: Olá! Em resposta às exigências do Banco Central do Brasil e do recém-criado comitê de agências reguladoras relevantes no Brasil, a plataforma precisa concluir a troca de dados entre o Banco Central e as agências reguladoras relevantes das ${withdrawBegin} às ${withdrawEnd}, horário brasileiro!Todos os nossos esforços são para garantir que a operação da plataforma esteja mais em conformidade com as leis e regulamentos brasileiros relevantes! Proteger a privacidade dos utilizadores e os direitos e interesses conexos. Obrigado pela sua compreensão. As retiradas serão normais durante outros períodos de tempo na plataforma.`,
  Identificator: 'Identificador',
  Value: 'Valor',
  depositMethod: 'Método De Depósito',
  depositStatus: 'Estado Do Depósito',
  withdrawalStatus: 'Status De Retirada',
  withdrawFee: 'Taxa de Retirada',
  CPFInputPlaceHolder: 'Por favor insira seu CPF',
  EmailInputPlaceHolder: 'Por favor insira seu e-mail',
  vipBannerText1: 'Níveis VIP',
  vipBannerText2DeskTop: 'Quanto Maior o Nível, Maior a',
  vipBannerText2Mobile: 'Quanto Maior o Nível',
  vipBannerText3DeskTop: 'Recompensa',
  vipBannerText3Mobile: 'Maior a Recompensa',
  CPFErrorMsg: 'Informe o CPF no formato correto',
  CNPJErrorMsg: 'Insira seu CNPJ no formato correto',
  EmailErrorMsg: 'Por favor insira seu e-mail',
  EmailErrorFormatMsg: 'Informe o Email no formato correto',
  withdrawSuccess: 'Retirada com sucesso',
  formatError: 'Erro de formato',
  withdrawOverLimit:
    'Você atingiu o limite de retirada de hoje, tente novamente amanhã!',
  privacyPolicy: 'Política de Privacidade',
  termsOfService: 'Termos de Serviço',
  VIPLevelDescription: 'Descrição do nível VIP',
  notificationPageTitle: 'Centro de Notificações',
  // Lucky Wheel
  totalBetsOfLuckyWheel: 'Total de apostas da Roda da Sorte',
  collectionRecords: 'Reg de Coletas',
  currentLuckyValueText: 'Pontos de sorte atuais',
  damaText: 'Ainda precisa de apostar',
  toGet: 'para obter',
  luckValueText: 'Pontos de sorte',
  otherRecords: 'Notificação de Prêmio',
  myRecords: 'Meus Registros',
  DateAndTime: 'Data e Hora',
  wheelWinnerDescriptionP1: 'Pessoa Vencedora e',
  wheelWinnerDescriptionP2: 'Tipo de Roda',
  Reward: 'Prêmio',
  totalDamaText: 'Total apostas durante o periodo do evento:',
  usedLuckyValueText: 'Valor de sorte utilizado:',
  expiredLuckyValueText: 'Valor da sorte expirado:',
  availableLuckyValueText: 'Valor de sorte disponível:',
  Tips: 'Dicas',
  luckyValueInsuffcirentHint: 'O seu valor de sorte não é suficiente',
  Close: 'Fechar',
  perSpinCostText: 'Pontos de sorte',
  Silver: 'Prata',
  Gold: 'Ouro',
  Diamond: 'Diamante',
  // 維護 Modal 文案
  maintenanceTitle: 'Prezados usuários VIP',
  maintenanceP1: (
    platformName: string,
    maintenanceStart: string,
    maintenanceEnd: string,
    maintenanceLeftTime: string
  ) => `O serviço do sistema ${platformName} está sendo atualizado e mantido.
  De ${maintenanceStart} (Brasil) até ${maintenanceEnd}, o tempo estimado de manutenção é de ${maintenanceLeftTime}. 
  Durante a manutenção do sistema, evite cadastro, login, jogos e outras operações. Obrigado pela sua compreensão e apoio!`,
  maintenanceP2: (
    platformName: string,
    telegramService: string | null
  ) => `Durante o período de manutenção do sistema, para evitar prejuízos, pedimos que não realize outras operações como depósitos e saques.
  Ao mesmo tempo, preparamos novas surpresas e recompensas de eventos para você, que serão anunciadas no ${platformName} Canal 
  ${telegramService} de tempos em tempos. Se você estiver interessado, por favor, junte-se o mais rápido possível. possível. O tempo do evento é limitado.`,
  maintenanceP3: `Após o término da manutenção do sistema, forneceremos atendimento ao cliente on-line 7 × 24 para responder às suas perguntas! Obrigado pela sua paciência!`,
  maintenanceP4: (platformGroup: string) => `Lançado pelo ${platformGroup}`,
  maintenanceP5: 'Alegria e emoções positivas dobram sua felicidade. Que o novo serviço traga mais recompensas e deixe você ir bem!',
  downloadModalText:
    'Ao digitalizar o código QR, você podejogar jogos de clienteinstantaneamente e sem problemas.',
  downloadAndroid: 'Baixar Android',
  // IOSDownloadModal
  IOSDownloadModalP1:
    '1.Copie e cole o link no seu navegador (Safári), clique na barra de ferramentas abaixo',
  IOSDownloadModalP2:
    '2.Após selecionar "Adicionar a tela de inicial", o link será aberto na área de trabalho',
  // TelegramContactModal 加入電報群 Modal
  Join: 'Junte-se',
  ComeToJoinUs: 'Junte-se a nós',
  telegramContactModalP1:
    'Prezados clientes VIP, juntem-se ao nosso canal oficial do Telegram.',
  telegramContactModalP2:
    'Realizaremos vários eventos de loteria de tempos em tempos.',
  telegramContactModalP3:
    'Dezenas de milhares de reais estão esperando por você para reivindicar.',
  // InviteBonusModal 邀請獎勵
  InviteBonusModalTitle: 'Convite Recompensa',
  InviteBonusModalText: 'Bônus de primeira recarga para usuários convidados',
  // DepositAdvertisementModal 餘額不足
  DepositAdvertisementModalTitle: 'Equilíbrio insuficiente!',
  DepositAdvertisementModalText: (
    recharge_first_cashback_rate: string | undefined
  ) => `Caros clientes VIP, você pode obter até ${
    recharge_first_cashback_rate || ''
  }
  de recompensa ao recarregar. Quanto mais você recarrega, mais bônus você
  recebe! Sem limite de tempo!`,
  // LeaveGameConfirmModal 退出遊戲 Modal
  Leave: 'Deixar',
  makeSureLeaveGame: 'Tem certeza de que deseja sair do jogo atual?',
  addThisGameToCollection: 'Adicione este jogo aos favoritos',
  Confirm: 'Confirme',
  Cancel: 'Cancelar',
  // TelegramDetailContactModal 聯絡客服 Modal
  ifUNeedHelpContactClient:
    'Se precisar de ajuda, entre em contato com o atendimento ao cliente',
  customerService: 'Atendimento ao cliente',
  businessRelatedContactManager:
    'Para cooperação comercial, entre em contato com o gerente',
  managerTelegram: 'Manager_telegram',
  clickToSkip: 'Clique no botão para pular',
  // U7UserInfoStatusPopover 首頁的右邊個人資訊 Popover
  totalBets: 'Número total de apostas',
  totalAccount: 'Total Da Conta',
  currentBetProgress: 'Progresso atual de apostas',
  totalPrize: 'Prêmio total',
  bonusAwaitingSettlement: 'Bônus aguardando liquidação',
  bonusAlreadySettled: 'Bônus já liquidados',
  // SettingPage
  Setting: 'Configuração',
  TelephoneNumber: 'Número de telefone',
  NickName: 'Apelido',
  Edit: 'Editar',
  CheckUpdate: 'Verifique actualizações',
  EditNickName: 'Alterar apelido favrito',
  SavedSuccess: 'Salvo com sucesso',
  enterNickname: 'Insira um apelido',
  onlyEnglishAndNumber: 'Apenas inglês ou números são suportados',
  nicknameLimit: 'nome de usuário (4-16 letras e números)',
  walletDeopsitVIPTips: (
    vip_level: number | undefined,
    withdrawLimitMin: string | undefined,
    withdrawLimitMax: string | undefined
  ) => `Atualmente VIP${vip_level}, o valor mínimo de saque diário é de R$ ${withdrawLimitMin} e o
  valor máximo de saque é de R$ ${withdrawLimitMax}.`,
  // 宝箱
  boxInternalTxt1:
    'Recomende aos seus amigos e ganhe bônus! Estamos sinceramente esperando que mais jogadores se juntem a nós!',
  boxInternalCopyLinkTxt: 'Copie o link para seus amigos!',
  boxInternalCopyTxt: 'Cópia',
  boxInternalRuleTxt:
    'Regras de liquidação da plataforma: O evento é atualizado a cada 10 a 30 minutos. Depois que as condições do convite forem atendidas, aguarde alguns minutos para reivindicar o bônus. Clique em "Reg de Coletas" para ver os detalhes do bônus.',
  boxInternalWarnTxt:
    'Nota: Para garantir a justiça, os usuários trapaceiros serão banidos permanentemente, os fundos obtidos ilegalmente serão congelados e as responsabilidades legais relevantes serão assumidas.',
  boxInternalOr: 'ou o acima mencionado',
  boxInternalRechargeTxt: 'O subordinado acumulou recargas ',
  boxInternalAnteTxt: 'O subordinado acumulou apostas',
  boxInternalInviteNumTxt: (inviteNum: string | number | undefined) =>
    `Pessoas de nível inferior eficazes ${inviteNum} pessoas`,
  boxInternalDetail: 'Detalhes',
  boxInternalReg: 'Reg de Coletas',
  boxInternalActivityDescription: 'Instruções Do Evento',
  boxInternalInvitePeopleNum: (num: string | number | undefined) =>
    `${num} pessoas`,
  confirmLogout: 'Tem certeza que deseja sair?',
  confirmLogoutU7: 'Se deve continuar saindo da conta atual?',
};

export default t;
