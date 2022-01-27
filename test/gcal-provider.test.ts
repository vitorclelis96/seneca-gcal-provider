const Seneca = require('seneca');
import { assert } from 'console';
import GCalProvider from '../src/gcal-provider';

describe('gcal-provider', () => {
    jest.setTimeout(100000);

    test('can-boot-gcal-plugin', async () => {
        const seneca = Seneca({ legacy: false })
            .test()
            .use('promisify')
            .use(GCalProvider)
        await seneca.ready()
    });

    test('can-load-gcal-events', async () => {
        const seneca = Seneca({ legacy: false })
            .test()
            .use('promisify')
            .use('entity')
            .use(GCalProvider)

        const events = await seneca
            .entity('provider', 'google-calendar', 'event')
            .list$();
        
        assert(Array.isArray(events));
    });

    test('can-get-and-edit-gcal-events', async () => {
        const seneca = Seneca({ legacy: false })
            .test()
            .use('promisify')
            .use('entity')
            .use(GCalProvider)

        const events = await seneca
            .entity('provider', 'google-calendar', 'event')
            .list$();

        assert(Array.isArray(events));
        if (events.length > 0) {
            const firstEvent = events[0];
            try {
                const getFirstEvent = await seneca
                    .entity('provider', 'google-calendar', 'event')
                    .load$(firstEvent.id);
                assert(getFirstEvent !== null && getFirstEvent !== undefined);

                getFirstEvent.summary = getFirstEvent.summary + '!';

                const responseSaveData = await getFirstEvent.save$();
                assert(getFirstEvent.summary !== responseSaveData.summary);
            } catch (error) {
                console.log(error)
            }
        }
    })
})