import { Text } from '@sitecore-jss/sitecore-jss-nextjs';
import Card from 'components/molecules/Card';
import { CardsProps } from 'src/types/types';

type VacancyCardsProps = CardsProps;

const VacancyCards = (props: VacancyCardsProps): JSX.Element => {
  const { datasource, item } = props.fields.data || {};
  return (
    <div>
      <Text field={datasource?.heading} />
      <div className="container">
        <div className="row">
          {item?.children?.results?.map((vacancy) => {
            const { image, bottomTitle, friendlyUrl } = vacancy?.relatedEmployer?.targetItem || {};
            return (
              <Card
                {...vacancy}
                image={image}
                bottomLink={{
                  value: {
                    text: bottomTitle.value,
                    href: friendlyUrl.value,
                  },
                }}
                url={`${friendlyUrl.value}/${vacancy.friendlyUrl.value}`}
                key={vacancy?.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VacancyCards;
