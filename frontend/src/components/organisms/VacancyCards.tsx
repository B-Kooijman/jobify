import { Text, Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Card from 'components/molecules/Card';

interface DataSource {
  heading: Field<string>;
  name: string;
  id: string;
}

interface Vacancies {
  results: [
    {
      id: string;
      title: Field<string>;
      text: Field<string>;
      relatedEmployer: {
        targetItem: {
          id: string;
          bottomTitle: Field<string>;
          image: ImageField;
        };
      };
    }
  ];
  pageTitle: {
    value: string;
  };
}

type VacancyCardsProps = {
  fields: {
    data: {
      datasource: DataSource;
      item: {
        vacancies: Vacancies;
      };
    };
  };
};

const VacancyCards = (props: VacancyCardsProps): JSX.Element => {
  const { datasource, item } = props.fields.data || {};
  console.log(props);

  return (
    <div>
      <Text field={datasource?.heading} />
      <div className="container">
        <div className="row">
          {item?.vacancies?.results?.map((vacancy) => {
            {
              console.log(vacancy);
            }
            const { image, bottomTitle } = vacancy?.relatedEmployer?.targetItem || {};
            return (
              <Card
                {...vacancy}
                image={image}
                bottomTitle={bottomTitle}
                url={`${bottomTitle.value}/${vacancy.title.value}`} //TODO: Create FriendlyURl
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
