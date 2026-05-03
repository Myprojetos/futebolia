export default function GamblingNotice() {
  return (
    <div className="border border-vermelho/30 bg-vermelho/5 rounded-xl p-4 my-6">
      <p className="font-heading font-bold text-vermelho text-sm mb-1">
        ⚠️ Jogue com Responsabilidade
      </p>
      <p className="font-body text-xs text-muted leading-relaxed">
        Apostas esportivas envolvem risco de perda financeira.{' '}
        <strong className="text-texto">Proibido para menores de 18 anos.</strong>{' '}
        Se o jogo estiver afetando sua vida, ligue <strong className="text-texto">141</strong> (CVV, gratuito, 24h).
        Divulgamos apenas casas licenciadas pelo Ministério da Fazenda (Lei 14.790/2023).
      </p>
    </div>
  )
}
