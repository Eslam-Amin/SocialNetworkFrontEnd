import "./SiteUnderMaintenance.css"
const imgSrc = require("./SiteUnderMaintenance.jpg")

function SiteUnderMaintenance() {
    console.log("hest")
    return (
        <div>
            <article>
                <h1>We&rsquo;ll be back soon!</h1>
                <div>
                    <p>Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment. If you need to you can always
                        &nbsp;
                        <a href="mailto:ea.eslamamin@gmail.com">contact us</a>,
                        otherwise we&rsquo;ll be back online shortly!</p>
                    <p>&mdash; The Team</p>

                </div>
            </article>
            <img src={imgSrc}
                style={{}}
                alt="Site is under maintenance" />
            <p className="copyright">&copy; By Eslam Amin.</p>
        </div>
    )
}

export default SiteUnderMaintenance
