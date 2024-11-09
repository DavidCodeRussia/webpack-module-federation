import { Link } from "react-router-dom"
import {shopRoutes} from '@packages/shared/src/routes/shop';

const Shop = () => {
  return (
    <h1>
      SHOP123
      <div>
        <Link to={shopRoutes.second}>go to second page</Link> 
      </div>
    </h1>
  )
}

export default Shop