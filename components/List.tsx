import * as React from 'react'
import ListItem from './ListItem'
import { User } from '../interfaces'

type Props = {
  items: User[]
}

const List = ({ items }: Props) => (
  <ul>
    {items && items.map((item) => (
      <li key={item.pk}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
)

export default List