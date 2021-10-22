import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { ImageFieldValue } from '@sitecore-jss/sitecore-jss-react/types/components/Image';
import Card from 'components/molecules/Card';
import { useI18n } from 'next-localization';

type EmployerCards = {
  fields: {
    data: {
      contextItem: {
        title: Field<string>;
        text: Field<string>;
        image: ImageFieldValue;
      };
      search: {
        total: number;
        results: [
          {
            id: string;
            friendlyUrl: Field<string>;
            title: Field<string>;
            text: Field<string>;
          }
        ];
      };
    };
  };
};

const EmployerCards = (props: EmployerCards): JSX.Element => {
  const { t } = useI18n();
  const { contextItem, search } = props.fields.data || {};
  const title =
    search.total != 0
      ? search?.total === 1
        ? t('EmployerIntroductionTitleSingle')?.replace('{0}', contextItem?.title?.value)
        : t('EmployerIntroductionTitle')
            ?.replace('{0}', search?.total?.toString())
            .replace('{1}', contextItem?.title?.value)
      : null;

  const text = t('EmployerIntroductionText')?.replace('{0}', contextItem?.text?.value);

  console.log(props);
  return (
    <div>
      <br />
      <h1>{text}</h1>
      <h2>{title}</h2>
      <div className="container">
        <div className="row">
          {search?.results?.map((vacancy) => {
            const { friendlyUrl } = vacancy;
            return (
              <Card
                {...vacancy}
                image={{ value: { src: contextItem.image?.src } }}
                // bottomLink={{
                //   value: {
                //     text: bottomTitle.value,
                //     href: friendlyUrl.value,
                //   },
                // }}
                url={friendlyUrl.value}
                key={vacancy?.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployerCards;
