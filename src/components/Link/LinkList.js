import React from 'react'
import axios from 'axios'
import { FirebaseContext } from '../../firebase'
import LinkItem from './LinkItem'
import { LINKS_PER_PAGE } from '../../utils'

function LinkList(props) {
  const { firebase } = React.useContext(FirebaseContext)
  const [links, setLinks] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const isNewPage = props.location.pathname.includes('new')
  const isTopPage = props.location.pathname.includes('top')
  const page = Number(props.match.params.page)
  const linksRef = firebase.db.collection('links')

  React.useEffect(() => {
    const unsubscribe = getLinks()
    return () => unsubscribe()
  }, [isTopPage, page])

  function getLinks() {
    setLoading(true)

    if (isTopPage) {
      return linksRef
        .orderBy('voteCount', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot)
    } else {
      const offset = page * LINKS_PER_PAGE - LINKS_PER_PAGE
      axios
        .get(
          `https://us-central1-hooks-news-a15e1.cloudfunctions.net/linksPagination?offset=${offset}`
        )
        .then(response => {
          const links = response.data
          setLinks(links)
          setLoading(false)
        })
      return () => {}
    }
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() }
    })
    setLinks(links)
    setLoading(false)
  }

  function visitPreviousPage() {
    if (page > 1) {
      props.history.push(`/new/${page - 1}`)
    }
  }

  function visitNextPage() {
    if (page <= links.length / LINKS_PER_PAGE) {
      props.history.push(`/new/${page + 1}`)
    }
  }

  const pageIndex = page ? (page - 1) * LINKS_PER_PAGE + 1 : 1

  return (
    <div style={{ opacity: loading ? 0.25 : 1 }}>
      {links.map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + pageIndex}
        />
      ))}
      {isNewPage && (
        <div className="pagination">
          <div className="pointer mr2" onClick={visitPreviousPage}>
            Previous
          </div>
          <div className="pointer" onClick={visitNextPage}>
            Next
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkList
