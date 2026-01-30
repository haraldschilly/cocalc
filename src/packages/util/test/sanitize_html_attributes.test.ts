
/*
 *  This file is part of CoCalc: Copyright © 2020 Sagemath, Inc.
 *  License: MS-RSL – see LICENSE.md for details
 */

import { sanitize_html_attributes } from '../misc';

describe('sanitize_html_attributes', () => {
    // Mock jQuery
    const mockRemoveAttr = jest.fn();
    const $ = (node) => ({
        removeAttr: mockRemoveAttr
    });
    $.each = (collection, callback) => {
        // Handle array-like objects (NamedNodeMap)
        if (collection && typeof collection.length === 'number') {
            for (let i = 0; i < collection.length; i++) {
                callback.call(collection[i], i, collection[i]);
            }
        } else if (collection) {
             for (const item of collection) {
                callback.call(item);
            }
        }
    };

    beforeEach(() => {
        mockRemoveAttr.mockClear();
    });

    test('removes onclick attribute', () => {
        const node = {
            attributes: [
                { name: 'onclick', value: 'alert(1)' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).toHaveBeenCalledWith('onclick');
    });

    test('removes ONCLICK attribute (mixed case name)', () => {
        const node = {
            attributes: [
                { name: 'ONCLICK', value: 'alert(1)' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).toHaveBeenCalledWith('ONCLICK');
    });

    test('removes onmouseover attribute', () => {
         const node = {
            attributes: [
                { name: 'onmouseover', value: 'alert(1)' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).toHaveBeenCalledWith('onmouseover');
    });


    test('removes href with javascript:', () => {
        const node = {
            attributes: [
                { name: 'href', value: 'javascript:alert(1)' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).toHaveBeenCalledWith('href');
    });

    test('removes href with leading whitespace javascript:', () => {
        const node = {
            attributes: [
                { name: 'href', value: ' javascript:alert(1)' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).toHaveBeenCalledWith('href');
    });

     test('removes href with mixed case Javascript:', () => {
        const node = {
            attributes: [
                { name: 'href', value: 'Javascript:alert(1)' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).toHaveBeenCalledWith('href');
    });

    test('removes href with tab/newline javascript:', () => {
        const node = {
            attributes: [
                { name: 'href', value: '\tjava\nscript:alert(1)' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).toHaveBeenCalledWith('href');
    });

    test('removes href with vbscript:', () => {
        const node = {
            attributes: [
                { name: 'href', value: 'vbscript:msgbox(1)' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).toHaveBeenCalledWith('href');
    });

    test('preserves valid href', () => {
        const node = {
            attributes: [
                { name: 'href', value: 'https://cocalc.com' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).not.toHaveBeenCalled();
    });

    test('preserves valid class', () => {
        const node = {
            attributes: [
                { name: 'class', value: 'btn btn-primary' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).not.toHaveBeenCalled();
    });
     test('preserves valid src', () => {
        const node = {
            attributes: [
                { name: 'src', value: 'image.png' }
            ]
        };
        sanitize_html_attributes($, node);
        expect(mockRemoveAttr).not.toHaveBeenCalled();
    });

});
