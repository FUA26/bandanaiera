import {Dialog, DialogTrigger} from "@/components/ui/dialog";

export function HeroYoutubeModal() {
  return (
    <div className="mb-4">
      <Dialog>
        <DialogTrigger asChild>
          <img alt="hero" className="hover:cursor-pointer" src="/images/hero.png" />
        </DialogTrigger>
      </Dialog>
    </div>
  );
}
