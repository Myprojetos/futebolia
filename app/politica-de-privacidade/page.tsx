import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade e proteção de dados do Futebolia conforme a LGPD.',
}

export default function PoliticaPrivacidade() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-heading font-extrabold text-4xl mb-2">Política de Privacidade</h1>
      <p className="text-muted font-body text-sm mb-10">Última atualização: maio de 2026</p>

      <div className="prose prose-invert prose-lg font-body space-y-8">

        <section>
          <h2>1. Quem somos</h2>
          <p>O <strong>Futebolia</strong> (futebolia.com.br) é um portal de conteúdo sobre Inteligência Artificial aplicada ao futebol e à Copa do Mundo 2026. Este site é operado de forma independente e pode conter links de parceiros e afiliados.</p>
        </section>

        <section>
          <h2>2. Dados que coletamos</h2>
          <p>Coletamos apenas dados estritamente necessários para o funcionamento do site:</p>
          <ul>
            <li><strong>Cookies de analytics:</strong> páginas visitadas, tempo de permanência e origem do tráfego (via Google Analytics 4), de forma anônima e agregada.</li>
            <li><strong>Cookies de funcionamento:</strong> preferências de consentimento de cookies.</li>
            <li><strong>Dados de cliques em afiliados:</strong> registramos cliques em links de parceiros para fins de comissão, sem identificar o usuário individualmente.</li>
          </ul>
          <p>Não coletamos nome, CPF, endereço, dados bancários ou qualquer informação pessoal sensível.</p>
        </section>

        <section>
          <h2>3. Como usamos os dados</h2>
          <ul>
            <li>Melhorar a qualidade e relevância do conteúdo publicado</li>
            <li>Entender quais artigos são mais úteis para os leitores</li>
            <li>Contabilizar comissões de programas de afiliados</li>
          </ul>
          <p>Nunca vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.</p>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>Utilizamos cookies para analytics e funcionamento básico do site. Ao acessar o Futebolia, você pode aceitar ou recusar cookies não essenciais através do banner de consentimento.</p>
          <p>Para recusar cookies a qualquer momento, ajuste as configurações do seu navegador ou clique em "Gerenciar cookies" no rodapé do site.</p>
        </section>

        <section>
          <h2>5. Links de afiliados e parceiros</h2>
          <p>Este site contém links de afiliados. Quando você clica em um link de parceiro e realiza uma compra ou cadastro, podemos receber uma comissão — sem custo adicional para você.</p>
          <p>Nossa política editorial é independente de relações comerciais. Recomendamos apenas produtos e serviços que consideramos relevantes para nosso público.</p>
        </section>

        <section>
          <h2>6. Conteúdo sobre apostas esportivas</h2>
          <p>O Futebolia divulga apenas casas de apostas licenciadas pelo Ministério da Fazenda do Brasil, conforme a Lei 14.790/2023.</p>
          <p><strong>Todo conteúdo sobre apostas é destinado exclusivamente a maiores de 18 anos.</strong> Apostar envolve risco de perda financeira. Nunca aposte valores que não pode perder.</p>
          <p>Se você ou alguém que você conhece apresenta comportamento compulsivo relacionado a jogos, ligue <strong>141</strong> (CVV — 24h, gratuito).</p>
        </section>

        <section>
          <h2>7. Seus direitos (LGPD)</h2>
          <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a:</p>
          <ul>
            <li>Confirmar a existência de tratamento de seus dados</li>
            <li>Solicitar a exclusão de dados coletados</li>
            <li>Revogar consentimento a qualquer momento</li>
            <li>Obter informações sobre compartilhamento de dados</li>
          </ul>
          <p>Para exercer esses direitos, entre em contato pelo email informado abaixo.</p>
        </section>

        <section>
          <h2>8. Segurança</h2>
          <p>Adotamos medidas técnicas adequadas para proteger os dados coletados, incluindo conexão HTTPS, sem armazenamento de dados sensíveis e uso de provedores de infraestrutura com certificações de segurança (Vercel).</p>
        </section>

        <section>
          <h2>9. Contato</h2>
          <p>Dúvidas sobre esta política ou sobre o tratamento de seus dados:</p>
          <p><strong>Email:</strong> privacidade@futebolia.com.br</p>
        </section>

      </div>
    </div>
  )
}
