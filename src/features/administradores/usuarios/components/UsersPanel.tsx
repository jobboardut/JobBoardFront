import type { UserCard } from '../../types/usersDashboard.types'

type UsersPanelProps = {
  cards: UserCard[]
}

function UsersPanel({ cards }: UsersPanelProps) {
  return (
    <section className="panel users-panel" id="usuarios">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Usuarios del sistema</p>
          <h2>Usuarios recientes</h2>
        </div>
      </div>

      <div className="user-grid">
        {cards.map((userCard) => (
          <article key={userCard.title} className={`user-card tone-${userCard.tone}`}>
            <div className="user-card-top">
              <div>
                <p className="user-indicator">{userCard.indicator}</p>
                <h3>{userCard.title}</h3>
              </div>
              <strong className="user-count">{userCard.count}</strong>
            </div>

            <p className="user-description">{userCard.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default UsersPanel