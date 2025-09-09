# 📋 Instruções de Configuração - Aplicativo de Carteira Digital

## 🎯 Visão Geral

Este documento fornece instruções detalhadas para configurar seu aplicativo de carteira digital React Native com integração ao Google Sheets. O aplicativo utiliza sua planilha do Google Sheets como banco de dados e o Google Apps Script como backend.

## 📊 Configuração da Planilha Google Sheets

### 1. Estrutura da Planilha

Sua planilha deve ter **exatamente** a seguinte estrutura para funcionar corretamente com o aplicativo:

#### Aba "Transactions" (Obrigatória)

| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E | Coluna F |
|----------|----------|----------|----------|----------|----------|
| **Date** | **Description** | **Amount** | **Type** | **Category** | **Remarks** |

**Descrição das Colunas:**
- **Date**: Data da transação (formato: YYYY-MM-DD)
- **Description**: Descrição da transação
- **Amount**: Valor da transação (positivo para receitas, negativo para despesas)
- **Type**: Tipo da transação ("Income" ou "Expense")
- **Category**: Categoria da transação
- **Remarks**: Observações adicionais (opcional)

#### Aba "Categories" (Opcional)

| Coluna A | Coluna B |
|----------|----------|
| **Name** | **Type** |

**Descrição das Colunas:**
- **Name**: Nome da categoria
- **Type**: Tipo associado ("Income" ou "Expense")

### 2. Exemplo de Dados

#### Transações de Exemplo:
```
Date        | Description      | Amount  | Type    | Category           | Remarks
2025-09-09  | Salário         | 3500.00 | Income  | Salário           | Pagamento mensal
2025-09-08  | Supermercado    | -120.50 | Expense | Alimentação       | Compras da semana
2025-09-07  | Freelance       | 800.00  | Income  | Freelance         | Projeto web
```

#### Categorias de Exemplo:
```
Name                    | Type
Salário                | Income
Freelance              | Income
Alimentação            | Expense
Transporte             | Expense
```

## 🔧 Configuração do Google Apps Script

### 1. Criando o Apps Script

1. Abra sua planilha no Google Sheets
2. Vá em **Extensões** > **Apps Script**
3. Apague o código padrão
4. Cole o conteúdo do arquivo `GOOGLE_APPS_SCRIPT_UPDATED.js`
5. **IMPORTANTE**: Substitua a linha `const SPREADSHEET_ID = '...'` pelo ID da sua planilha

### 2. Encontrando o ID da Planilha

O ID da planilha está na URL:
```
https://docs.google.com/spreadsheets/d/[ID_DA_PLANILHA]/edit
```

Por exemplo, se sua URL for:
```
https://docs.google.com/spreadsheets/d/1oRHQTApGbXCgg2-c6yPIlict_WfRCnBvl-vwtJdH8RI/edit
```

O ID é: `1oRHQTApGbXCgg2-c6yPIlict_WfRCnBvl-vwtJdH8RI`

### 3. Implantando o Apps Script

1. No editor do Apps Script, clique em **Implantar** > **Nova implantação**
2. Escolha o tipo: **Aplicativo da web**
3. Configure:
   - **Descrição**: "API para Aplicativo de Carteira Digital"
   - **Executar como**: "Eu"
   - **Quem tem acesso**: "Qualquer pessoa"
4. Clique em **Implantar**
5. **Copie a URL do aplicativo da web** - você precisará dela no aplicativo

### 4. Testando a Integração

Após implantar, teste se está funcionando:
1. Abra a URL gerada em um navegador
2. Adicione `?action=test` no final da URL
3. Você deve ver: `{"status":"success","data":{"status":"success","message":"Connection successful"}}`

## 📱 Configuração do Aplicativo

### 1. Instalação

```bash
# Extrair o projeto
unzip WalletApp_Final.zip

# Navegar para o diretório
cd WalletApp

# Instalar dependências
npm install
```

### 2. Executando o Aplicativo

```bash
# Para web
npm run web

# Para mobile (Expo Go)
npm start
```

### 3. Configuração Inicial

1. **Tela de Boas-vindas**: Defina o nome do seu aplicativo
2. **Configuração do App**: Escolha moeda e idioma
3. **Configuração da API**: 
   - **URL do Apps Script**: Cole a URL gerada na implantação
   - **ID da Planilha**: Cole o ID da sua planilha
4. **Teste de Conexão**: Clique em "Testar Conexão" para verificar
5. **Conclusão**: Clique em "Começar" para usar o aplicativo

## 🔍 Solução de Problemas

### Erro de Conexão

**Problema**: "Connection failed" durante o teste
**Soluções**:
1. Verifique se a URL do Apps Script está correta
2. Certifique-se de que o ID da planilha está correto
3. Confirme que o Apps Script foi implantado com acesso "Qualquer pessoa"
4. Teste a URL do Apps Script diretamente no navegador

### Dados Não Aparecem

**Problema**: Aplicativo conecta mas não mostra dados
**Soluções**:
1. Verifique se as abas "Transactions" e "Categories" existem
2. Confirme que os nomes das colunas estão exatos (em inglês)
3. Adicione algumas transações de teste na planilha
4. Reinicie o aplicativo

### Erro ao Salvar Transação

**Problema**: "Failed to add transaction"
**Soluções**:
1. Verifique se todos os campos obrigatórios estão preenchidos
2. Confirme que a aba "Transactions" existe
3. Teste se o Apps Script tem permissão de escrita na planilha

## 📋 Checklist de Configuração

- [ ] Planilha criada com abas "Transactions" e "Categories"
- [ ] Colunas nomeadas corretamente (em inglês)
- [ ] Apps Script criado e código colado
- [ ] ID da planilha atualizado no código
- [ ] Apps Script implantado como aplicativo da web
- [ ] URL do Apps Script copiada
- [ ] Aplicativo instalado e dependências instaladas
- [ ] Configuração inicial do aplicativo concluída
- [ ] Teste de conexão bem-sucedido
- [ ] Primeira transação adicionada com sucesso

## 🎉 Pronto para Usar!

Após seguir todas as etapas, seu aplicativo estará totalmente funcional e conectado à sua planilha do Google Sheets. Todas as transações adicionadas no aplicativo serão automaticamente salvas na planilha, e os dados exibidos no aplicativo serão sempre atualizados em tempo real.

## 📞 Suporte

Se encontrar problemas durante a configuração, verifique:
1. Se todos os passos foram seguidos corretamente
2. Se as permissões do Google Apps Script estão configuradas
3. Se a estrutura da planilha está exata
4. Se a conexão com a internet está estável

O aplicativo foi projetado para ser robusto e informar erros específicos quando algo não está funcionando corretamente.

