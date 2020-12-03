import Layout from "../components/Layout"
import Link from "next/link"
import { withApollo } from "../apollo/client"
import gql from "graphql-tag"
import { useQuery } from "@apollo/react-hooks"

const DraftsQuery = gql`
  query DraftsQuery {
    drafts {numara baslik aciklama aktif gorevlipersonel {kullanici eposta kisa_ad } }
  }
`

const Post = ({ post }) => (
  <Link href="/p/[id]" as={`/p/${post.numara}`}>
    <a>
      <h2>{post.baslik}</h2>
      <small>By {post.gorevlipersonel ? post.gorevlipersonel.kullanici : "Unknown Author"}</small>
      <p>{post.aciklama}</p>
      <style jsx>{`
        a {
          text-decoration: none;
          color: inherit;
          padding: 2rem;
          display: block;
        }
      `}</style>
    </a>
  </Link>
)

const Drafts = () => {
  const { loading, error, data } = useQuery(DraftsQuery)

  if (loading) {
    return <div>Loading ...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Layout>
      <div className="page">
        <h1>Drafts</h1>
        <main>
          {data.drafts.map((post) => (
            <div key={post.baslik} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default withApollo(Drafts)
