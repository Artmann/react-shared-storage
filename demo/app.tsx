import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Section } from './section'

export function App(): ReactElement {
  return (
    <Container>
      <Section id='section-1' />
      <Section id='section-2' />
      <Section id='section-3' />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`