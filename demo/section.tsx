import React, { ReactElement } from 'react'
import styled from 'styled-components'
 
import { usePersistentState } from '../src'

type SectionProps = {
  id: string
}

export function Section({ id }: SectionProps): ReactElement {

  const [ index, setIndex ] = usePersistentState(`index-${ id }`, 0)

  const colors = [
    '#0e7490',
    '#b91c1c',
    '#334155',
    '#047857',
    '#5b21b6'
  ]
  
  const color = colors[ index % colors.length ]

  return (
    <StyledSection
      color={ color }
      onClick={ () => setIndex(index + 1) }
    >
      <Text>
        Click me.
      </Text>
    </StyledSection>
  )
}

const Text = styled.div`
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  text-transform: uppercase;
  user-select: none;
`;

const StyledSection = styled.div`
  align-items: center;
  background: ${ ({ color }) => color };
  border-bottom: solid 1px #fff;
  display: flex;
  flex: 1;
  justify-content: center;
  width: 100%;
`