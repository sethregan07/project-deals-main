import React, { useState } from 'react';
import { Card, Text, Group } from '@mantine/core';
import classes from './FeaturesCard.module.css';

export default function SmallCard(props) {
  const { smallData, selectProduct, closeSecondModal} = props;
  const { id, img, name } = smallData;

  // const { price, currency, storeImg, discount } = deal;

  // State variable to track the click status
  const [isClicked, setIsClicked] = useState(false);

  // Function to handle the card click
  const handleCardClick = () => {
    setIsClicked(!isClicked);
    selectProduct(id)
    closeSecondModal()
  };

  // Conditionally apply a CSS class based on the click status
  const cardClassName = `${classes.card} ${isClicked ? classes.clicked : ''}`;

  return (
    <Card withBorder radius="md" className={cardClassName} mb={6} onClick={handleCardClick}>
      <Card.Section className={classes.imageSection}>
        <img  style={{ height: '140px' }} src={img} alt={name} />
      </Card.Section>

      <Group justify="space-between">
        <div>
          <Text lineClamp={2} fw={500}>{name}</Text>
        </div>
      </Group>

      <Card.Section className={classes.section}>
        <Group gap={30}>
          <div>
            {/* <Text size="sm" pb={4}>Price</Text> */}
            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
              {/* {currency}{price} */}
            </Text>
          </div>
        </Group>
      </Card.Section>
    </Card>
  );
}
