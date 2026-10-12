import { CollectionList } from "../collection-list";
import { getCollectionList } from "../service";

type CollectionsPageContentProps = {
  data: Awaited<ReturnType<typeof getCollectionList>>;
};

export async function CollectionsPageContent({ data }: CollectionsPageContentProps) {
  return (
    <div className="bg-background">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Collections
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Explore curated collections of skincare, makeup, fragrance, hair
            care, jewelry, watches, beauty accessories, and thoughtful gifts
            selected for confident everyday routines.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <CollectionList data={data} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="max-w-4xl space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-xl font-semibold text-foreground">
            Curated Beauty and Lifestyle Collections
          </h2>
          <p>
            Aurevia Elegance brings beauty and personal-style essentials into
            easy-to-browse edits. Discover skincare for everyday routines,
            makeup and fragrance for every mood, plus accessories, jewelry, and
            watches selected to complete your look.
          </p>
          <p>
            Whether you are shopping for a daily essential, a new arrival, or
            a considered gift, each collection helps you compare relevant
            products and find the right fit with delivery across Pakistan.
          </p>
        </div>
      </section>
    </div>
  );
}
