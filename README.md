# Atividade: Refatoração de Projeto Orientado a Objetos

## 1. Contexto

Este projeto implementa um sistema simples de pedidos para uma loja virtual chamada **TechStore**.

O sistema permite criar pedidos, calcular descontos e frete, processar pagamentos, atualizar o estoque, registrar pedidos e enviar notificações aos clientes.

O objetivo da atividade é analisar a organização das classes e dos métodos, identificar oportunidades de melhoria e refatorar o projeto aplicando princípios de orientação a objetos, especialmente os princípios SOLID.

## 2. Objetivos da atividade

- Identificar problemas na organização de classes e métodos.
- Avaliar coesão, acoplamento e distribuição de responsabilidades.
- Aplicar os princípios SOLID.
- Utilizar composição quando adequado.
- Aplicar o Princípio de Demeter.
- Melhorar a testabilidade e a manutenção do sistema.
- Preservar o comportamento esperado das funcionalidades.

## 3. Tecnologias utilizadas

- Node.js
- JavaScript
- Jest para testes automatizados

## 4. Requisitos para execução

- Node.js versão 20 ou superior.
- npm instalado.
- Terminal aberto na pasta raiz do projeto.

## 5. Como executar o projeto

### 5.1. Instalar as dependências

Na pasta raiz do projeto, execute:

```bash
npm install
```

### 5.2. Iniciar a aplicação

Execute:

```bash
npm start
```

### 5.3. Executar os testes automatizados

Para verificar o funcionamento dos testes, execute:

```bash
npm test
```

## 6. Refatoração do projeto

A refatoração busca melhorar a organização interna do código, distribuindo as responsabilidades entre classes e serviços específicos.

Entre os aspectos trabalhados no projeto estão:

- Separação das responsabilidades de validação e cálculo do pedido.
- Organização dos cálculos de descontos e frete.
- Separação do processamento de pagamentos por estratégia.
- Uso de injeção de dependências para facilitar os testes.
- Organização das responsabilidades de persistência e notificação.
- Avaliação do encapsulamento e da aplicação do Princípio de Demeter.

As melhorias descritas devem corresponder às alterações efetivamente implementadas no código-fonte.

## 7. Entregáveis da atividade

1. Código-fonte refatorado, disponibilizado em um repositório GitHub.
2. Relatório técnico contendo:
   - Problemas de projeto identificados.
   - Princípios ou conceitos relacionados.
   - Refatorações realizadas.
   - Justificativas técnicas para as alterações.

## 8. Critérios de avaliação

- Identificação correta dos problemas de projeto: **2,0 pontos**.
- Aplicação adequada dos princípios SOLID: **2,0 pontos**.
- Uso adequado de composição e redução de acoplamento: **1,5 ponto**.
- Aplicação do Princípio de Demeter e melhoria da coesão: **1,0 ponto**.
- Qualidade da refatoração e preservação do comportamento: **1,5 ponto**.
- Testes automatizados e evidências de execução: **1,0 ponto**.
- Clareza do relatório e justificativas técnicas: **1,0 ponto**.

**Total: 10,0 pontos.**

## 9. Observação

As refatorações devem melhorar a estrutura interna do projeto sem alterar o resultado esperado das funcionalidades. Os testes automatizados devem ser utilizados para verificar a preservação do comportamento após as alterações.
