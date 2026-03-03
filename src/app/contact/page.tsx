export default function Contact() {
    return (
        <section className="w-screen h-screen flex flex-col px-20 py-20 gap-20">
            <div className="w-2/3 mt-20">
                <p className="text-justify text-md font-light font-inter">
                    TERRIER FILM is a lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis
                    libero condimentum, suscipit quam vel, efficitur magna. Mauris consectetur porttitor
                    pellentesque. Vivamus maximus tortor mattis commodo posuere. Sed venenatis, odio sit amet
                    lacinia interdum, nisl eros gravida enim, sit amet pretium elit urna sit amet magna.
                    Vestibulum interdum pharetra finibus.
                </p>
            </div>
            <div className="w-full flex text-sm">
                <div className="w-1/2">
                    <h3 className="uppercase text-gray-200 font-thin mb-4">Contact</h3>
                    <div className="flex flex-col gap-6 font-plex">
                        <div className="">
                            <p>Alejo Ayala</p>
                            <p>Lorem Ipsum, Director</p>
                            <p>alejo@gmail.com</p>
                            <a className="text-xs uppercase">Instagram</a>
                        </div>
                        <div className="">
                            <p>Arturo Casaú</p>
                            <p>Lorem Ipsum, Director</p>
                            <p>arturo@gmail.com</p>
                            <a className="text-xs uppercase">Instagram</a>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-20 font-plex">
                    <div>
                        <h3 className="uppercase text-gray-200 font-thin mb-4 ">Office</h3>
                        <p>Calle Definición 203</p>
                        <p>08010 Barcelona</p>
                        <p>España</p>
                    </div>
                    <div className="flex flex-col">
                        <a>Vimeo</a>
                        <a>Instagram</a>
                    </div>
                </div>
            </div>
        </section>
    )
}