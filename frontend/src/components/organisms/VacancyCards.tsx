import Card from 'components/molecules/Card';
import { useI18n } from 'next-localization';
import { CardsProps } from 'src/types/types';

type VacancyCardsProps = CardsProps;

const VacancyCards = (props: VacancyCardsProps): JSX.Element => {
  const { t } = useI18n();
  const { item } = props.fields.data || {};
  return (
    <div>
      <br />
      <h2>{t('VacanciesText')}</h2>
      <br />
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
