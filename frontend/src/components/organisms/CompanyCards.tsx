import Card from 'components/molecules/Card';
import { useI18n } from 'next-localization';
import { CardsProps } from 'src/types/types';

type CompanyCardsProps = CardsProps;

const CompanyCards = (props: CompanyCardsProps): JSX.Element => {
  const { t } = useI18n();
  const { item } = props.fields.data || {};

  return (
    <div>
      <br />
      <h2>{t('CompaniesText')}</h2>
      <br />

      <div className="container">
        <div className="row">
          {item?.children?.results?.map((company) => {
            const { image, friendlyUrl } = company;
            return (
              <Card
                {...company}
                text={{ value: '' }}
                image={image}
                url={friendlyUrl.value}
                key={company?.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompanyCards;
