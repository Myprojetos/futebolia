import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer e Termos de Uso',
  description: 'Termos de uso, disclaimer de afiliados e aviso de jogo responsável do Futebolia.',
}

export default function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-heading font-extrabold text-4xl mb-2">Disclaimer e Termos de Uso</h1>
      <p className="text-muted font-body text-sm mb-10">Última atualização: maio de 2026</p>

      <div className="prose prose-invert prose-lg font-body space-y-8">

        <section>
          <h2>1. Natureza do conteúdo</h2>
          <p>O Futebolia publica conteúdo <strong>informativo e educacional</strong> sobre Inteligência Artificial aplicada ao futebol, apostas esportivas, turismo e ferramentas para pequenas empresas. Nenhum conteúdo publicado neste site constitui aconselhamento financeiro, jurídico ou de investimento.</p>
        </section>

        <section>
          <h2>2. Apostas esportivas — aviso obrigatório</h2>
          <div className="bg-red-950/30 border border-red-800/50 rounded-xl p-6 not-prose">
            <p className="font-heading font-bold text-red-400 text-lg mb-3">⚠️ Jogue com Responsabilidade</p>
            <ul className="font-body text-sm text-red-200/80 space-y-2">
              <li>• Apostas esportivas envolvem <strong>risco real de perda financeira</strong></li>
              <li>• <strong>Proibido para menores de 18 anos</strong></li>
              <li>• Nunca aposte dinheiro que você não pode perder</li>
              <li>• Apostas não são uma fonte de renda garantida</li>
              <li>• Se o jogo estiver afetando sua vida: ligue <strong>141</strong> (CVV, gratuito, 24h)</li>
            </ul>
          </div>
          <p>O Futebolia não incentiva apostas compulsivas. Divulgamos apenas casas de apostas licenciadas pelo <strong>Ministério da Fazenda do Brasil</strong> conforme a Lei 14.790/2023.</p>
        </section>

        <section>
          <h2>3. Disclaimer de afiliados</h2>
          <p>Este site participa de programas de afiliados. Alguns links neste site são links de parceiros comerciais — se você clicar e realizar uma compra ou cadastro, podemos receber uma comissão.</p>
          <p>Isso <strong>não tem custo adicional para você</strong> e não influencia nossas recomendações editoriais. Recomendamos apenas produtos e serviços que consideramos genuinamente úteis.</p>
        </section>

        <section>
          <h2>4. Precisão das informações</h2>
          <p>Nos esforçamos para manter o conteúdo atualizado e preciso. No entanto, odds, preços e disponibilidade de produtos podem mudar a qualquer momento. Sempre verifique as informações diretamente na fonte antes de tomar qualquer decisão.</p>
        </section>

        <section>
          <h2>5. Propriedade intelectual</h2>
          <p>Todo conteúdo publicado no Futebolia — textos, imagens e layouts — é de propriedade do Futebolia ou licenciado para uso. É proibida a reprodução sem autorização prévia e expressa.</p>
        </section>

        <section>
          <h2>6. Limitação de responsabilidade</h2>
          <p>O Futebolia não se responsabiliza por decisões tomadas com base no conteúdo publicado, por perdas em apostas esportivas, ou por eventuais imprecisões em preços e disponibilidades de produtos de terceiros.</p>
        </section>

        <section>
          <h2>7. Contato</h2>
          <p><strong>Email:</strong> contato@futebolia.com.br</p>
        </section>

      </div>
    </div>
  )
}
