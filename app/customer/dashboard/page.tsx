import axios from 'axios';

export const metadata = {
    title: 'Dashboard - Customer | CoDriver',
};
export default async function Dashboard() {
    // Get cat id
    const res = await axios.get('https://api.thecatapi.com/v1/images/search', {
        params: {
            api_key: process.env.CAT_API_KEY,
            limit: 1,
            has_breeds: 1,
        },
    });
    // Get cat info
    const info = await axios.get(`https://api.thecatapi.com/v1/images/${res.data[0].id}`);
    const catInfo = info.data.breeds[0];
    return (
        <div className='hero min-h-screen bg-neutral'>
            <div className='hero-content flex-col lg:flex-row'>
                <img
                    src={info.data.url}
                    alt='Cat Image'
                    className='max-w-sm rounded-lg shadow-2xl'
                />
                <div>
                    <h1 className='text-5xl md:text-2xl font-bold'>Name: {catInfo.name}</h1>
                    <p className='py-3 text-2xl md:text-lg'>
                        Origin: {catInfo.origin} ({catInfo.country_code})
                    </p>
                    <p className='py-3 text-2xl md:text-lg'>
                        Temperament: {catInfo.temperament || 'None'}
                    </p>
                    <p className='py-3 text-2xl md:text-lg'>
                        Alternative Names: {catInfo.alt_names || 'None'}
                    </p>
                    <p className='py-3 text-lg md:text-sm'>
                        Description: {catInfo.description || 'Unable to get description'}
                    </p>
                    <div className='join'>
                        <button className='btn join-item btn-primary md:text-md'>
                            <a href={catInfo.vetstreet_url}>Characteristics & Quick Facts</a>
                        </button>
                        <button className='btn join-item btn-secondary md:text-md'>
                            <a href={catInfo.vcahospitals_url}>History & Others</a>
                        </button>
                        <button className='btn join-item btn-accent md:text-md'>
                            <a href={catInfo.wikipedia_url}>Wikipedia</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
